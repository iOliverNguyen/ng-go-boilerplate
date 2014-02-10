package main

import (
	"http"
)

func init() {
	http.Handle("/assets", http.FileServer(http.Dir("assets")))
	http.Handle("/src", http.FileServer(http.Dir("src")))
	http.Handle("/vendor", http.FileServer(http.Dir("vendor")))
}
