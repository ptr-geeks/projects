package helpers

import (
	"strings"
)

func Contains[T comparable](s []T, e T) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func Insert[T any](a []T, index int, value T) []T {
	if len(a) == index { // nil or empty slice or after last element
		return append(a, value)
	}
	a = append(a[:index+1], a[index:]...) // index < len(a)
	a[index] = value
	return a
}

func Remove[T any](s []T, i int) []T {
	s[i] = s[len(s)-1]
	return s[:len(s)-1]
}

func RemoveOrdered[T any](slice []T, s int) []T {
	return append(slice[:s], slice[s+1:]...)
}

func PowInts(x, n int) int {
	if n == 0 {
		return 1
	}
	if n == 1 {
		return x
	}
	y := PowInts(x, n/2)
	if n%2 == 0 {
		return y * y
	}
	return x * y * y
}

type Card struct {
	Type string
	Name string
	Full string
}

func ParseCardID(cardId string) Card {
	v := strings.Split(cardId, "/")
	return Card{v[1], v[2], cardId}
}

func Abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
