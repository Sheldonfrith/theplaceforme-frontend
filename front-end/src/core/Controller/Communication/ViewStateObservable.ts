import {ViewStateObservable as IViewStateObservable, ViewState, ListenerCallback} from '../../HelperTypes';

// view layer can register with this ObservableState to be notified whenever state changes they care about occur

export default class ViewStateObservable implements IViewStateObservable{
    protected currentStateString: string = '';
    protected registeredListeners: {[id: string]:(newState:any)=>any}= {noOne:(newState)=>{},};
    public register(id: string, callbackOnStateChange: (state: ViewState) => void){
        this.registeredListeners[id] = callbackOnStateChange;
    }
    public update(newState: any){
        const isDifferent = (this.currentStateString !== JSON.stringify(newState));
        if (isDifferent) Object.keys(this.registeredListeners).forEach(id=> {
            this.registeredListeners[id](newState);
        })
    }
}