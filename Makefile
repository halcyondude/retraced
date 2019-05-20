
.PHONY: cache
cache:
	cd admin && make build-cache
	cd logs-viewer && make build-cache
	cd api && make build-cache

.PHONY: test
test:
	cd logs-viewer && make test

	cd migrations/fixtures && make build run
	cd migrations && docker build -t retraceddev/retraced-fixtures:local -f ./fixtures/deploy/Dockerfile ./fixtures

	cd api && make test
