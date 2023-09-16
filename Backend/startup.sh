docker network create -d bridge game-compass

docker build --pull --rm -f "Users API\dockerfile" -t game-compass_users-api:latest "Users API"

docker-compose -p game-compass up -d