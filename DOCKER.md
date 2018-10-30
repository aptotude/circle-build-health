# Using circle-build-health with Docker

1. Run `$ docker build -t aptotude/circle-build-health:latest .`
2. Run `$ docker run --rm -p 80:3000 -e "RAZZLE_USE_AUTH0=false" -e "RAZZLE_CIRCLE_CI_TOKEN=foobar" aptotude/circle-build-health:latest`. Replace the environment values with the configuration you need.

## TODO:

Create an auto-build on <https://hub.docker.com/> to build the Dockerfile and publish it to `aptotude/circle-build-health`. Then, step 1 can be removed above, and any end user can simply run the container with the run command above.
