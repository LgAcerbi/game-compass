import ResourceDTO from "./resource-dto";

export default interface EvaluateDTO extends Omit<ResourceDTO, "name" | "id"> {
    token: string;
}
