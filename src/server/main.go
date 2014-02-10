package main

import (
	"flag"
	"log"
	"net/http"

	"labix.org/v2/mgo"
)

const (
	kIndexHtml = "index.html"
)

var (
	flPort   = flag.String("port", "80", "port")
	flDir    = flag.String("dir", "public", "resource dir")
	flDbName = flag.String("dbname", "clinic", "database name")

	db     *mgo.Database
	dbname string
)

func connectDatabase(connectionString, databaseName string) *mgo.Database {
	session, err := mgo.Dial(connectionString)
	if err != nil {
		panic("Error connecting database: " + connectionString)
	}

	dbname = databaseName
	db = session.DB(dbname)
	return db
}

func main() {
	flag.Parse()

	rootDir := *flDir
	if rootDir[len(rootDir)-1] != '/' {
		rootDir += "/"
	}

	connectDatabase("127.0.0.1", *flDbName)

	fileServer := http.FileServer(http.Dir(rootDir))
	http.Handle("/", fileServer)

	log.Printf("Start server, port=%v, dir=%v", *flPort, rootDir)
	http.ListenAndServe(":"+*flPort, nil)
}
