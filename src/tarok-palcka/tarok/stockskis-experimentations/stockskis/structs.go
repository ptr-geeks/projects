package stockskis

import "strings"

const StockSkisVersion = "Alpha 0.0.1"

type Player struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Playing       bool   `json:"playing"`
	Cards         []Card `json:"cards"`
	FallenTarocks []Card `json:"fallen_tarocks"`
	PadliSrci     []Card `json:"fallen_hearts"`   // src
	PadliPiki     []Card `json:"fallen_spades"`   // pik
	PadliKrizi    []Card `json:"fallen_clubs"`    // križ
	PadleKare     []Card `json:"fallen_diamonds"` // kara
}

type Deck struct {
	ID         string `json:"id"`
	PickedUpBy string `json:"picked_up_by"`
	Cards      []Move `json:"cards"`
}

type Move struct {
	ID     string `json:"id"`
	UserID string `json:"user_id"`
	Card   Card   `json:"card"`
	Value  int    `json:"value"`
}

type Card struct {
	File      string
	Worth     int
	WorthOver int
	Alt       string
}

var CARDS = []Card{
	{File: "/kara/1", Worth: 1, WorthOver: 4, Alt: "1 kara"},
	{File: "/kara/2", Worth: 1, WorthOver: 3, Alt: "2 kara"},
	{File: "/kara/3", Worth: 1, WorthOver: 2, Alt: "3 kara"},
	{File: "/kara/4", Worth: 1, WorthOver: 1, Alt: "4 kara"},
	{File: "/kara/pob", Worth: 2, WorthOver: 5, Alt: "Kara pob"},
	{File: "/kara/kaval", Worth: 3, WorthOver: 6, Alt: "Kara kaval"},
	{File: "/kara/dama", Worth: 4, WorthOver: 7, Alt: "Kara dama"},
	{File: "/kara/kralj", Worth: 5, WorthOver: 8, Alt: "Kara kralj"},

	{File: "/kriz/7", Worth: 1, WorthOver: 1, Alt: "7 križ"},
	{File: "/kriz/8", Worth: 1, WorthOver: 2, Alt: "8 križ"},
	{File: "/kriz/9", Worth: 1, WorthOver: 3, Alt: "9 križ"},
	{File: "/kriz/10", Worth: 1, WorthOver: 4, Alt: "10 križ"},
	{File: "/kriz/pob", Worth: 2, WorthOver: 5, Alt: "Križ pob"},
	{File: "/kriz/kaval", Worth: 3, WorthOver: 6, Alt: "Križ kaval"},
	{File: "/kriz/dama", Worth: 4, WorthOver: 7, Alt: "Križ dama"},
	{File: "/kriz/kralj", Worth: 5, WorthOver: 8, Alt: "Križ kralj"},

	{File: "/pik/7", Worth: 1, WorthOver: 1, Alt: "7 pik"},
	{File: "/pik/8", Worth: 1, WorthOver: 2, Alt: "8 pik"},
	{File: "/pik/9", Worth: 1, WorthOver: 3, Alt: "9 pik"},
	{File: "/pik/10", Worth: 1, WorthOver: 4, Alt: "10 pik"},
	{File: "/pik/pob", Worth: 2, WorthOver: 5, Alt: "Pik pob"},
	{File: "/pik/kaval", Worth: 3, WorthOver: 6, Alt: "Pik kaval"},
	{File: "/pik/dama", Worth: 4, WorthOver: 7, Alt: "Pik dama"},
	{File: "/pik/kralj", Worth: 5, WorthOver: 8, Alt: "Pik kralj"},

	{File: "/src/1", Worth: 1, WorthOver: 4, Alt: "1 src"},
	{File: "/src/2", Worth: 1, WorthOver: 3, Alt: "2 src"},
	{File: "/src/3", Worth: 1, WorthOver: 2, Alt: "3 src"},
	{File: "/src/4", Worth: 1, WorthOver: 1, Alt: "4 src"},
	{File: "/src/pob", Worth: 2, WorthOver: 5, Alt: "Src pob"},
	{File: "/src/kaval", Worth: 3, WorthOver: 6, Alt: "Src kaval"},
	{File: "/src/dama", Worth: 4, WorthOver: 7, Alt: "Src dama"},
	{File: "/src/kralj", Worth: 5, WorthOver: 8, Alt: "Src kralj"},

	{File: "/taroki/pagat", Worth: 5, WorthOver: 11, Alt: "Pagat"},
	{File: "/taroki/2", Worth: 1, WorthOver: 12, Alt: "2"},
	{File: "/taroki/3", Worth: 1, WorthOver: 13, Alt: "3"},
	{File: "/taroki/4", Worth: 1, WorthOver: 14, Alt: "4"},
	{File: "/taroki/5", Worth: 1, WorthOver: 15, Alt: "5"},
	{File: "/taroki/6", Worth: 1, WorthOver: 16, Alt: "6"},
	{File: "/taroki/7", Worth: 1, WorthOver: 17, Alt: "7"},
	{File: "/taroki/8", Worth: 1, WorthOver: 18, Alt: "8"},
	{File: "/taroki/9", Worth: 1, WorthOver: 19, Alt: "9"},
	{File: "/taroki/10", Worth: 1, WorthOver: 20, Alt: "10"},
	{File: "/taroki/11", Worth: 5, WorthOver: 21, Alt: "11"},
	{File: "/taroki/12", Worth: 1, WorthOver: 22, Alt: "12"},
	{File: "/taroki/13", Worth: 1, WorthOver: 23, Alt: "13"},
	{File: "/taroki/14", Worth: 1, WorthOver: 24, Alt: "14"},
	{File: "/taroki/15", Worth: 1, WorthOver: 25, Alt: "15"},
	{File: "/taroki/16", Worth: 1, WorthOver: 26, Alt: "16"},
	{File: "/taroki/17", Worth: 1, WorthOver: 27, Alt: "17"},
	{File: "/taroki/18", Worth: 1, WorthOver: 28, Alt: "18"},
	{File: "/taroki/19", Worth: 1, WorthOver: 29, Alt: "19"},
	{File: "/taroki/20", Worth: 1, WorthOver: 30, Alt: "20"},
	{File: "/taroki/mond", Worth: 5, WorthOver: 31, Alt: "Mond"},
	{File: "/taroki/skis", Worth: 5, WorthOver: 32, Alt: "Škis"},
}

func ParseCard(cardId string) (string, int, int) {
	k := strings.Split(cardId, "/")
	for _, v := range CARDS {
		if cardId != v.File {
			continue
		}
		return k[1], v.Worth, v.WorthOver
	}
	return "", 0, 0
}
