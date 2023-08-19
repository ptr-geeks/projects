package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/mytja/Tarok/backend/internal/sql"
	"github.com/mytja/Tarok/backend/internal/ws"
	"github.com/rs/cors"
	goji "goji.io"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/spf13/cobra"
	"go.uber.org/zap"
	"goji.io/pat"
)

var (
	server ws.Server
)

type ServerConfig struct {
	Debug    bool
	Host     string
	Port     string
	Path     string
	Postgres string
}

type TokenResponse struct {
	UserID string `json:"user_id"`
	Token  string `json:"token"`
	Role   string `json:"role"`
	Email  string `json:"email"`
	Name   string `json:"name"`
}

func main() {
	config := ServerConfig{}

	command := &cobra.Command{
		Use:   "ptrun-server",
		Short: "Game server for PTRun",
		Run: func(cmd *cobra.Command, args []string) {
			run(&config)
		},
	}

	command.Flags().BoolVar(&config.Debug, "debug", true, "enable debug mode")
	command.Flags().StringVar(&config.Host, "host", "0.0.0.0", "set server host")
	command.Flags().StringVar(&config.Port, "port", "8080", "set server port")
	command.Flags().StringVar(&config.Path, "path", "/ws", "set server WS path")
	command.Flags().StringVar(&config.Postgres, "pghost", "127.0.0.1", "set server postgres host")

	if err := command.Execute(); err != nil {
		//fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run(config *ServerConfig) {
	var logger *zap.Logger
	var err error

	if config.Debug {
		logger, err = zap.NewDevelopment()
	} else {
		logger, err = zap.NewProduction()
	}

	if err != nil {
		panic(err)
	}

	sugared := logger.Sugar()

	db, err := sql.NewSQL("postgres", fmt.Sprintf("host=%s database=Tarok port=5432 user=postgres password=postgres sslmode=disable", config.Postgres), sugared)
	if err != nil {
		sugared.Errorw("failed to initialize database", "err", err)
		return
	}
	db.Init()

	server = ws.NewServer(logger, db)
	go server.Run()

	sugared.Infow("starting websocket endpoint",
		"host", config.Host,
		"port", config.Port,
		"path", config.Path)

	mux := goji.NewMux()
	mux.HandleFunc(pat.Get(fmt.Sprintf("%s/:id", config.Path)), func(w http.ResponseWriter, r *http.Request) {
		server.Connect(w, r)
	})
	mux.HandleFunc(pat.Get("/games"), func(w http.ResponseWriter, r *http.Request) {
		user, err := db.CheckToken(r)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		games, priorityGames := server.GetGames(user.ID)
		g := map[string][]ws.GameDescriptor{
			"games":         games,
			"priorityGames": priorityGames,
		}
		marshal, err := json.Marshal(g)
		if err != nil {
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write(marshal)
	})
	mux.HandleFunc(pat.Get("/friends/get"), server.GetFriends)
	mux.HandleFunc(pat.Post("/friends/add"), server.AddFriendByEmail)
	mux.HandleFunc(pat.Post("/friends/remove"), server.RemoveFriend)
	mux.HandleFunc(pat.Post("/friends/accept_decline"), server.IncomingFriendRequestAcceptDeny)
	mux.HandleFunc(pat.Post("/quick"), func(w http.ResponseWriter, r *http.Request) {
		user, err := db.CheckToken(r)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		playerCount, err := strconv.Atoi(r.FormValue("players"))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		tip := r.FormValue("tip")
		if !(tip == "normal" || tip == "klepetalnica") {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		defaultTime := ws.DEFAULT_TIME
		if tip == "klepetalnica" {
			defaultTime = ws.KLEPETALNICA_TIME
		}

		additionalTime := ws.DEFAULT_ADDITIONAL_TIME
		if tip == "klepetalnica" {
			additionalTime = ws.KLEPETALNICA_TIME
		}

		game := server.GetMatch(playerCount, tip, user)
		if game == "CREATE" {
			logger.Info("creating new game")
			game = server.NewGame(playerCount, tip, false, user.ID, additionalTime, int(defaultTime), false, false)
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(game))
	})
	mux.HandleFunc(pat.Post("/game/new/:gamemode/:type"), func(w http.ResponseWriter, r *http.Request) {
		user, err := db.CheckToken(r)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		t := pat.Param(r, "type")
		if !(t == "normal" || t == "klepetalnica") {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		atoi, err := strconv.Atoi(pat.Param(r, "gamemode"))
		if err != nil {
			sugared.Debugw("atoi failed", "err", err)
			return
		}

		private, err := strconv.ParseBool(r.FormValue("private"))
		if err != nil {
			sugared.Debugw("atoi failed", "err", err)
			return
		}

		mondfang, err := strconv.ParseBool(r.FormValue("mondfang"))
		if err != nil {
			sugared.Debugw("atoi failed", "err", err)
			return
		}

		if !(atoi == 3 || atoi == 4) {
			sugared.Debugw("atoi failed", "err", err)
			return
		}

		additionalTime, err := strconv.ParseFloat(r.FormValue("pribitek"), 64)
		if err != nil {
			sugared.Debugw("atoi failed", "err", err)
			return
		}

		startTime, err := strconv.Atoi(r.FormValue("zacetniCas"))
		if err != nil {
			sugared.Debugw("atoi failed", "err", err)
			return
		}

		skisfang, err := strconv.ParseBool(r.FormValue("skisfang"))
		if err != nil {
			sugared.Debugw("atoi failed", "err", err)
			return
		}

		w.WriteHeader(http.StatusOK)

		game := server.NewGame(atoi, t, private, user.ID, additionalTime, startTime, skisfang, mondfang)

		w.Write([]byte(game))
	})
	mux.HandleFunc(pat.Get("/admin/reg_code"), func(w http.ResponseWriter, r *http.Request) {
		user, err := db.CheckToken(r)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		if user.Role != "admin" {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		codes, err := db.GetCodes()
		if err != nil {
			sugared.Debugw("error while fetching codes", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		marshal, err := json.Marshal(codes)
		if err != nil {
			sugared.Debugw("error while marshalling", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write(marshal)
	})
	mux.HandleFunc(pat.Post("/admin/reg_code"), func(w http.ResponseWriter, r *http.Request) {
		user, err := db.CheckToken(r)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		if user.Role != "admin" {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		err = db.InsertCode(sql.Code{Code: r.FormValue("code")})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	})
	mux.HandleFunc(pat.Delete("/admin/reg_code"), func(w http.ResponseWriter, r *http.Request) {
		user, err := db.CheckToken(r)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		if user.Role != "admin" {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		err = db.DeleteCode(r.FormValue("code"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	})
	mux.HandleFunc(pat.Post("/register"), func(w http.ResponseWriter, r *http.Request) {
		email := r.FormValue("email")
		pass := r.FormValue("pass")
		name := r.FormValue("name")
		regCode := r.FormValue("regCode")
		if email == "" || pass == "" || name == "" {
			sugared.Errorw("empty fields", "email", email, "name", name)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		// Check if user is already in DB
		var userCreated = true
		_, err := db.GetUserByEmail(email)
		if err != nil {
			if err.Error() == "sql: no rows in result set" {
				userCreated = false
			} else {
				sugared.Errorw("error while fetching from database", "err", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
		}
		if userCreated {
			sugared.Errorw("user is already created")
			w.WriteHeader(http.StatusUnprocessableEntity)
			return
		}

		password, err := sql.HashPassword(pass)
		if err != nil {
			sugared.Errorw("password hashing error", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		var role = "member"

		isAdmin := !db.CheckIfAdminIsCreated()
		if isAdmin {
			role = "admin"
		}

		if role != "admin" {
			_, err := db.GetRegistrationCode(regCode)
			if err != nil {
				w.WriteHeader(http.StatusForbidden)
				return
			}
		}

		sugared.Debugw("registering a new user", "regCode", regCode)

		user := sql.User{
			Email:    r.FormValue("email"),
			Password: password,
			Role:     role,
			Name:     name,
		}

		err = db.InsertUser(user)
		if err != nil {
			sugared.Errorw("inserting user to the database has failed", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	})
	mux.HandleFunc(pat.Post("/login"), func(w http.ResponseWriter, r *http.Request) {
		email := r.FormValue("email")
		pass := r.FormValue("pass")
		user, err := db.GetUserByEmail(email)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		hashCorrect := sql.CheckHash(pass, user.Password)
		if !hashCorrect {
			// nočmo razkrit če uporabnik že obstaja tho
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		var token string
		if user.LoginToken == "" {
			token, err = db.GetRandomToken(user)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
		} else {
			token = user.LoginToken
		}

		response := TokenResponse{Token: token, Role: user.Role, UserID: user.ID, Email: user.Email, Name: user.Name}
		marshal, err := json.Marshal(response)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(marshal)
	})

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"}, // All origins
		AllowedHeaders: []string{"X-Login-Token"},
		AllowedMethods: []string{"POST", "GET", "DELETE", "PATCH", "PUT", "OPTIONS"},
	})

	srv := &http.Server{
		Handler: c.Handler(mux),
		Addr:    fmt.Sprintf("%s:%s", config.Host, config.Port),
		// These should probably be moved under internal/const
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
		IdleTimeout:  15 * time.Second,
	}

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			sugared.Errorw("error starting http server", zap.Error(err))
		}
	}()

	<-done
	sugared.Debug("stopping")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer func() {
		// If we need any more cleanup, it should go here

		// We should probably check and gracefully shutdown everything at this
		// point and also disconnect all our clients
		cancel()
	}()

	if err := srv.Shutdown(ctx); err != nil {
		sugared.Errorw("error shutting down http server", zap.Error(err))
	}
}
