# Retraced API

Key responsibilities of the retraced API include:

- Receiving and storing CreateEvent requests
- Creating ViewerTokens to power the embeded `logs` viewer
- Responding to queiries from embedded `logs` with results from Elasticsearch
- Probably some EITAPI stuff
- Tokens, stats, etc.

## Usage

#### Run tests
> `yarn test`

#### Running with Skaffold

> `skaffold dev -f skaffold.yaml`

## Swagger Documentation

Swagger spec is generated from source using [TSOA](https://github.com/lukeautry/tsoa)

By default, a swagger spec is built as part of `make build`, and is served by express at `/publisher/v1/swagger.json`.


#### Generating a spec

To generate swagger.json from Typescript sources use

```
make swagger
```

The outputs will be written to build/swagger.json

#### Previewing a spec

The first time you generate markup, you will need to `make markup-deps` to install tooling.

Then you can

```
make markup-docs
```

which will build `build/swagger.adoc`, convert to `build/swagger.html`, and open using `google-chrome`


## Building library images for on-prem

```sh
docker build --pull -t registry.replicated.com/library/retraced:${SEMVER} -f deploy/Dockerfile-slim .
docker push registry.replicated.com/library/retraced:${SEMVER}
```
