SHELL := /bin/bash
PROJECT_NAME ?= retracedfixtures

.PHONY: deps
deps:
	yarn --silent

.PHONY: prebuild
prebuild:
	rm -rf build
	mkdir -p build

.PHONY: lint
lint:
	npx tslint --project ./tsconfig.json --fix

.PHONY: build
build: prebuild deps
	`yarn bin`/tsc --project .

.PHONY: run
run:
	node --no-deprecation ./build/fixtures.js generate

.PHONY: publish
publish: REGISTRY = replicated
publish:
	docker build -f deploy/Dockerfile -t ${PROJECT_NAME}:latest .
	docker tag ${PROJECT_NAME}:latest $(REGISTRY)/${PROJECT_NAME}:latest
	docker push $(REGISTRY)/${PROJECT_NAME}:latest

.PHONY: schema-fixtures
schema-fixtures:
	docker pull schemahero/schemahero:alpha
	docker run -e uid=$$UID -v `pwd`:/out -v `pwd`/../tables:/in schemahero/schemahero:alpha fixtures --input-dir /in --output-dir /out/schema --dbname retraced-postgres --driver postgres
