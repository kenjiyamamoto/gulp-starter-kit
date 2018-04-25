GULP=./node_modules/.bin/gulp

install:
	npm install

run:
	$(GULP)

watch:
	$(GULP) js:watch css:watch

lint:
	$(GULP) js:lint

build:
	$(GULP) js:build css:build
