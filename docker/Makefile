.PHONY: greetings hello

hello: 
	GOOS=linux GOARCH=amd64 go build hello.go

greetings:
	GOOS=linux GOARCH=amd64 go build -o greetings.linux greetings.go

greetings-image: greetings
	docker build . -t greetings
	docker build . -t greetings:v1.0.0

# this will run the image with the tag latests 
grettings-run:
	docker run --name greetings greetings:latest

greetingsjs-image:
	docker build . -t greetings-js -f ./Dockerfile.greetings.js

