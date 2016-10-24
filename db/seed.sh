#!/bin/sh -x

mongoimport --db inventory --collection users --file ./users.json --jsonArray

mongoimport --db inventory --collection articles --file ./articles.json --jsonArray
