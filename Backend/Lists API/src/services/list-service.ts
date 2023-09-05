import HttpError from "../helpers/http-error";
import ListDTO from "../dtos/list-dto";
import ListModel from "../models/list-model";

class ListService {
    static async createList(list: ListDTO) {
        const { id } = await ListModel.createList(list);

        return { ...list, id };
    }
}

export default ListService;
