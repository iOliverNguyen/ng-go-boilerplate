#!/bin/sh

mongo blankdb --eval "db.dropDatabase()"
for f in res/dbsample/*.js ; do mongo blankdb $f ; done
