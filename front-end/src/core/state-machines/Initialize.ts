import {AppMachine}from './App/machine';
import {UserMachine}from './User/machine';
import {PopupMachine}from'./Popup/machine';
import {LayoutMachine}from './Layout/machine';
import {PageMachine} from './Page/machine';
import { Machine, interpret, assign, spawn, sendParent, StateMachine, Interpreter } from "xstate";
import * as t from '../HelperTypes';
// import StateMachineObserver from '../../../src2/Controller/StateMachineObserver';
import MachineToViewStateAdapter from '../../../src2/Controller/MachineToViewStateAdapter';
// import ViewController, {ViewStateObservable, MachineStateObserver} from '../../../src2/Controller';


// const stateMachineObserver = new StateMachineObserver(machineToViewStateAdapter.handleNewState);
// const viewController = new ViewController({});
export interface IActiveMachines {
    app: t.ActiveSMachine,
    layout: t.ActiveSMachine,
    user: t.ActiveSMachine,
    popup: t.ActiveSMachine,
    page: t.ActiveSMachine,
}

const activateAndGetMachines = (): IActiveMachines=>{
    return {
        app: startAndReturnMachine(AppMachine),
        layout: startAndReturnMachine(LayoutMachine),
        user: startAndReturnMachine(UserMachine),
        popup: startAndReturnMachine(PopupMachine),
        page: startAndReturnMachine(PageMachine),
    };
}
export default activateAndGetMachines;

const startAndReturnMachine = (machine: t.SMachine): t.ActiveSMachine=>{
    const name = machine.id;
    const newMachine = interpret(machine, {devTools: true}).onTransition(
        (state)=>{
            // stateMachineObserver.update(name,state);
        } 
    );
    newMachine.start();
    return newMachine;
}