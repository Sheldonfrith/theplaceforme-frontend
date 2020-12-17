

export interface IModel{

}

export class Model implements IModel{

}

export interface IModels {
    get(modelClassName: string):IModel,
    remove(modelClassName: string):void,
    add(model: IModel):void,
    replace(modelToRemoveName: string, modelToPutInItsPlace: IModel): void,
}
type modelsStore = {[modelName: string]: IModel};
export class Models implements IModels {
    protected models: modelsStore = {};
    public constructor(params: {models: IModel[]}){
        params.models.forEach(model => this.models[model.constructor.name] = model);
    }
    public get(modelClassName: string){
        return this.models[modelClassName];
    }
    public remove (modelClassName: string){
        delete this.models[modelClassName];
    }
    public add (model: IModel) {
        this.models[model.constructor.name] = model;
    }
    public replace (modelToRemoveName: string, modelToPutInItsPlace: IModel){
        this.models[modelToRemoveName] = modelToPutInItsPlace;
    }
}