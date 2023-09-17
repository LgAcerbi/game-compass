docker network create -d bridge game-compass

docker build --pull --rm -f "Users API\dockerfile" -t game-compass_users-api:latest "Users API"

docker build --pull --rm -f "Auth API\dockerfile" -t game-compass_auth-api:latest "Auth API"

docker build --pull --rm -f "Lists API\dockerfile" -t game-compass_lists-api:latest "Lists API"

docker-compose -p game-compass up -d