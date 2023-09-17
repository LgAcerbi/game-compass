import RoleDTO from "../dtos/role-dto";
import RoleModel from "../models/role-model";
import HttpError from "../helpers/http-error";

class RoleService {
    static async findRoleById(id: string): Promise<RoleDTO> {
        const foundRole = await RoleModel.findRoleById(id);

        if (!foundRole) {
            throw new HttpError(404, "Role not found");
        }

        return foundRole;
    }

    static async createResource(roleData: RoleDTO): Promise<RoleDTO> {
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
