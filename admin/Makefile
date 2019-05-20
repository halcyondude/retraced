
SHELL := /bin/bash
PROJECT_NAME ?= retraced-admin

.PHONY: clean
clean:
	rm -rf node_modules
	rm -rf dist

.PHONY: deps
deps:
	yarn --silent --frozen-lockfile

.PHONY: test
test: deps
	yarn run test:pact:api

.PHONY: build-cache
build-cache:
	@-docker pull retraceddev/${PROJECT_NAME}:latest > /dev/null 2>&1 ||:
	docker build -f Dockerfile.skaffoldcache -t retraceddev/${PROJECT_NAME}:latest .

.PHONY: publish-cache
publish-cache:
	docker push retraceddev/${PROJECT_NAME}:latest

.PHONY: serve
serve:
	VENDOR_WEB_ENV=composer node --max-old-space-size=6144 `npm bin`/webpack-dev-server --config webpack.config.js --color -w --mode development

