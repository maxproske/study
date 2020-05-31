# Build image using new BuildKit engine
COMPOSE_DOCKER_CLI_BUILD=1 \
    DOCKER_BUILDKIT=1 \
    docker-compose build --parallel

docker-compose up