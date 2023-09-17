import ResourceDTO from "../dtos/resource-dto";
import ResourceModel from "../models/resource-model";
import HttpError from "../helpers/http-error";

class ResourceService {
    static async findResourceByEndpointData(
        endpointData: Pick<ResourceDTO, "method" | "endpoint" | "application">
    ): Promise<ResourceDTO> {
        const foundResource = await ResourceModel.findResourceByEndpointData(endpointData);

        if (!foundResource) {
            throw new HttpError(404, "Resource not found");
        }

        return foundResource;
    }

    static async findResourceById(id: string): Promise<ResourceDTO> {
        const foundResource = await ResourceModel.findResourceById(id);

        if (!foundResource) {
            throw new HttpError(404, "Resource not found");
        }

        return foundResource;
    }

    static async createResource(resourceData: ResourceDTO): Promise<ResourceDTO> {
        const { id } = await ResourceModel.createResource(resourceData);

        return { ...resourceData, id };
    }

    static async deleteResourceById(id: string) {
        const foundResource = await ResourceModel.findResourceById(id);

        if (!foundResource) {
            throw new HttpError(404, "Resource not found");
        }

        await ResourceModel.softDeleteResourceById(id);
    }
}

export default ResourceService;
