package main 

import (
	"fmt"
	"net/http"
	"os"
)

func greeting(w http.ResponseWriter, req *http.Request) {
	language := os.Getenv("LANG")

	switch language {
	  case "FR":
	    fmt.Fprintf(w, "bonjour\n")
	  case "ES":
	    fmt.Fprintf(w, "hola\n")
          default:
	    fmt.Fprintf(w, "hello\n")
	}
}

func main() {
	http.HandleFunc("/", greeting)

	http.ListenAndServe(":8090", nil)
}
