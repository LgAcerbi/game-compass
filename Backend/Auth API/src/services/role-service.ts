import RoleDTO from "../dtos/role-dto";
import RoleModel from "../models/role-model";
import HttpError from "../helpers/http-error";

class RoleService {
    static async findAllRoles(): Promise<Array<RoleDTO>> {
        const foundRoles = await RoleModel.findAllRoles();

        if (foundRoles.length === 0) {
            throw new HttpError(404, "Roles not found");
        }

        return foundRoles;
    }

    static async findRoleById(id: string): Promise<RoleDTO> {
        const foundRole = await RoleModel.findRoleById(id);

        if (!foundRole) {
            throw new HttpError(404, "Role not found");
        }

        return foundRole;
    }

    static async findRolesByIds(ids: Array<string>): Promise<Array<RoleDTO>> {
        const foundRoles = await RoleModel.findRolesByIds(ids);

        if (foundRoles.length === 0) {
            throw new HttpError(404, "Roles not found");
        }

        return foundRoles;
    }

    static async findDefaultRoles(): Promise<Array<RoleDTO>> {
        const foundRoles = await RoleModel.findDefaultRoles();

        if (foundRoles.length === 0) {
            throw new HttpError(404, "Default roles not found");
        }

        return foundRoles;
    }

    static async createRole(roleData: RoleDTO): Promise<RoleDTO> {
        roleData.default = roleData.default ? roleData.default : false;

        const { id } = await RoleModel.createRole(roleData);

        return { ...roleData, id };
    }

    static async deleteRoleById(id: string) {
        const foundRole = await RoleModel.findRoleById(id);

        if (!foundRole) {
            throw new HttpError(404, "Role not found");
        }

        await RoleModel.softDeleteRoleById(id);
    }
}

export default RoleService;
