SHELL := /bin/bash
PROJECT_NAME ?= retraced-api

.PHONY: deps
deps:
	yarn --silent --frozen-lockfile

.PHONY: prebuild
prebuild:
	rm -rf build
	mkdir -p build

.PHONY: lint
lint:
	npx tslint --project ./tsconfig.json --fix

.PHONY: build
build: prebuild
	`yarn bin`/tsc --project .

.PHONY: run
run:
	node --no-deprecation ./build/retracedctl.js serve

.PHONY: can-i-deploy
can-i-deploy:
	pact-broker can-i-deploy --pacticipant retraced-api --broker-base-url https://replicated-pact-broker.herokuapp.com --latest

.PHONY: build-cache
build-cache:
	@-docker pull retraceddev/${PROJECT_NAME}:latest > /dev/null 2>&1 ||:
	docker build -f Dockerfile.skaffoldcache -t retraceddev/${PROJECT_NAME}:latest .

.PHONY: publish-cache
publish-cache:
	docker push retraceddev/${PROJECT_NAME}:latest

# the sed command is because ug-format uses a bizarre import that does `require(__dirname + '/some-module')`
# and we need to change it to `require('./some-module')` to make `pkg` work, because pkg can't currently
# handle imports that are not string literals.
pkg:
	sed -i.bak "s/__dirname + '/'.\//g" node_modules/pg-format/lib/index.js
	npx pkg -t node10-linux --options no-deprecation --output bin/retraced-api .
	npx pkg -t node10-linux --options no-deprecation --output bin/retracedctl -c ./package.json ./build/retracedctl.js

.PHONY: test
test: export POSTGRES_URI = postgresql://retraced:password@localhost:15432/retraced?connect_timeout=10&application_name=retraced&sslmode=disable
test:
	@-docker rm -f retraced-fixtures > /dev/null 2>&1 ||:
	docker run --rm -d --name retraced-fixtures -p 15432:5432 retraceddev/retraced-fixtures:local
	yarn run test:local
	@-sleep 1
	docker rm -f retraced-fixtures
