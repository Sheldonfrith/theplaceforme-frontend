import {AppMachine}from './App/machine';
import {UserMachine}from './User/machine';
import {PopupMachine}from'./Popup/machine';
import {LayoutMachine}from './Layout/machine';
import {PageMachine} from './Page/machine';
import { Machine, interpret, assign, spawn, sendParent, StateMachine, Interpreter } from "xstate";
import * as t from '../HelperTypes';

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

const startAndReturnMachine = (machine: sMachine): activeSMachine=>{
    const newMachine = interpret(machine, {devTools: true}).onTransition(
        (state)=>{
            console.log(state.value);
        }
    );
    newMachine.start();
    return newMachine;

}