import React from 'react';
import {Interpreter, StateMachine}from 'xstate';

// expands object types one level deep
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// expands object types recursively
export type ExpandRecursively<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;


export type EmptyFunction = ()=>void;

export type EventHandler<EVENT> = (e: EVENT)=>void;

export type OnClickEvent = React.PointerEvent<HTMLElement>;
export type OnChangeEvent=  React.ChangeEvent<HTMLElement>;

export interface ViewObjectProps {
    id: number,
    text: string,
    onClick: OnClickEvent,
}

export interface ModelAsViewObjectProps {
    id: number,
    text: string,
}

export type ActiveSMachine = Interpreter<any,any,any>;
export type SMachine = StateMachine<any,any,any>;

export type XStateAction = (context?: any, event?:any) => any;
