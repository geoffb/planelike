build:
	mkdir -p build
	browserify -e js/main.js -o build/bundle.js -d
	cp index.html build

.PHONY: build
