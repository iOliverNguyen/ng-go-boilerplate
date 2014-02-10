package main

import (
	"net/http"
)

func init() {
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("src/assets"))))
	http.Handle("/src/", http.StripPrefix("/src/", http.FileServer(http.Dir("src"))))
	http.Handle("/vendor/", http.StripPrefix("/vendor/", http.FileServer(http.Dir("vendor"))))
}
