import PermissionModel from "../models/permission-model";
import PermissionDTO from "../dtos/permission-dto";
import HttpError from "../helpers/http-error";

class PermissionService {
    static async findPermissionById(id: string): Promise<PermissionDTO> {
        const foundPermission = await PermissionModel.findPermissionById(id);

        if (!foundPermission) {
            throw new HttpError(404, "Permission not found");
        }

        return foundPermission;
    }

    static async createPermission(permissionData: PermissionDTO): Promise<PermissionDTO> {
        const { id } = await PermissionModel.createPermission(permissionData);

        return { ...permissionData, id };
    }

    static async deletePermissionById(id: string) {
        const foundPermission = await PermissionModel.findPermissionById(id);

        if (!foundPermission) {
            throw new HttpError(404, "Permission not found");
        }

        await PermissionModel.softDeletePermissionById(id);
    }
}

export default PermissionService;
