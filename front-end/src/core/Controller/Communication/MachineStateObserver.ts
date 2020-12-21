import _ from 'lodash';
import {OnMainMachineStateChangedCallback, MainMachineState, GenericMachineState} from '../HelperTypes';
import Adapter from '../Adapter';

   // receiving events from the machines(state changes)
    // filtering out events we don't care about
    // applying the events we do care about to our MachineStateRelevantToView
    // converting our MachineStateRelevantToView to ViewState
    // updating the Observable with the new ViewState
    // sending out the new state to all the registered listeners

export default class StateMachineObserver {
    protected onMainStateChanged: OnMainMachineStateChangedCallback = ()=>{}; 
    protected blackListedMachines = [//machines who's state changes will always be ignored
        'ExampleMachine'
    ];
    protected mainState: MainMachineState = {};

    public constructor(){
        this.onMainStateChanged = onMainStateChanged;
    }
    public updateState(machineName: string, machineState: GenericMachineState){
        if (this.shouldChangeMainState(machineName, machineState)) this.mainState[machineName] = machineState;
        this.viewStateObservable.update(this.converter.convertToViewState(this.mainState));
        //then we need to process the main state, and send it along towards the view
        this.onMainStateChanged(this.mainState);
    }
    protected shouldChangeMainState(machineName: string, machineState: GenericMachineState){
        if (this.blackListedMachines.includes(machineName)) return false;
        if (this.newStateIsIdenticalToOldState(this.mainState[machineName], machineState)) return false;
        return true;
    }
    protected newStateIsIdenticalToOldState(oldState: GenericMachineState, newState: GenericMachineState){
        return _.isEqual(oldState, newState);
    }
}