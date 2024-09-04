.PHONY: build clean

GOOS=linux
GOARCH=amd64
BINARY=bootstrap

build:
	GOOS=$(GOOS) GOARCH=$(GOARCH) go build -o $(BINARY) *.go
	zip function.zip $(BINARY)

clean:
	rm -f $(BINARY) function.zip
