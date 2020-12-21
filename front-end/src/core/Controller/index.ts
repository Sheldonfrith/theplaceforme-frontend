import {ViewState, GenericMachineState, ViewStateObservable, ListenerCallback, MachineStateObserver}from '../HelperTypes';
import ViewStateObservable from './Communication/ViewStateObservable';
import MachineStateObserver from './Communication/MachineStateObserver';
import Adapter from './Adapter';

export interface IViewController {
    registerAsListener: ListenerCallback;
    updateState(machineName: string, newState: GenericMachineState):void;
}
export default class ViewController implements IViewController {
    protected observable;
    protected observer;
 

    public constructor(options: {}any){
        this.observable = new ViewStateObservable();
        this.observer = new MachineStateObserver();
    }
    public registerAsListener(listenerID: string, onChangeCallback: (state:ViewState)=>void):void{
        this.observable.register(listenerID, onChangeCallback);
    }
    public updateState(machineName: string, newState: GenericMachineState){
        this.observer.update(machineName, newState);
    }
}
