import ResourceDTO from "./resource-dto";

export default interface PermissionDTO {
    id: string;
    name: string;
    resources: Array<Pick<ResourceDTO, "id">>;
}
