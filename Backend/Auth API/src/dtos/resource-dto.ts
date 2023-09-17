export default interface ResourceDTO {
    id: string;
    name: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
    endpoint: string;
    application: "USERS-API" | "AUTH-API" | "LISTS-API" | "GAMES-API";
}
