#!/bin/bash

if [ "$CIRCLE_PROJECT_USERNAME" = "retracedhq" ] && [ "$CIRCLE_BRANCH" = "master" ]; then
  case $CIRCLE_NODE_INDEX in
  0)
    # build staging docker image
    BUILD_VERSION="${CIRCLE_SHA1:0:7}" make build_staging
    sudo docker build -t quay.io/retracedhq/app:${CIRCLE_SHA1:0:7}-stg $HOME/app

    # push staging image to registry
    sudo docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASS quay.io
    sudo docker push quay.io/retracedhq/app:${CIRCLE_SHA1:0:7}-stg
    ;;
  1)
    # build production docker image
    BUILD_VERSION="${CIRCLE_SHA1:0:7}" make build_prod
    sudo docker build -t quay.io/retracedhq/app:${CIRCLE_SHA1:0:7}-prd $HOME/app

    # push production image to registry
    sudo docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASS quay.io
    sudo docker push quay.io/retracedhq/app:${CIRCLE_SHA1:0:7}-prd
    ;;
  esac
fi
