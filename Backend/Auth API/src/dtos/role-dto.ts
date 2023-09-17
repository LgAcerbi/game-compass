import PermissionDTO from "./permission-dto";

export default interface RoleDTO {
    id: string;
    name: string;
    permissions: Array<Pick<PermissionDTO, "id">>;
}
