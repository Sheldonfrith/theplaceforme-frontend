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

export type GenericMachineState = any;
export type MainMachineState = {[key: string]:GenericMachineState};
export type OnMainMachineStateChangedCallback = (mainState: MainMachineState)=> any;
export type SendAdaptedViewState = (adaptedState: ViewState)=>any;
export interface ViewState{};

export type ListenerCallback = (listenerID: string, onChangeCallback: (state:ViewState)=>void)=>void;
export type ObservableUpdate = (newState: any)=> void;

export interface ViewStateObservable {
  register: ListenerCallback;
  update: ObservableUpdate;
}

export interface MachineStateObserver {
  update: (machineName: string, newState: GenericMachineState)=>void,
  
}
export interface QuestionModel<T> {
  id: number;
  text: string;
  type: 'dataset'|'complex';
  data: T;
}
export interface CategoryModel {
  id: number,
  text: string,
  associatedQuestionIDs: number[],
}
export interface ButtonModel {
  id: number,
  text: string,
  nameOfEventToSendOnClick: string,
}

interface Question_SCORES_Breakdown {
  score: number,
  rank: number,
  percentile: number,
  dataWasMissing: boolean
}
interface Question_SCORES_Breakdowns {
  [questionID: string]: Question_SCORES_Breakdown //number is score for that dataset
}
interface CategoryBreakdown {
  [category: string]: number // total score for that category
}
export interface Location_SCORES {
  primary_name: string,
  totalScore: number,
  rank: number,
  percentile: number,
  categoryBreakdown: CategoryBreakdown,
  question_SCORES_Breakdowns: Question_SCORES_Breakdowns,
}
export interface AllLocation_SCORES {
  [locationID: string]: Location_SCORES
}

//VIEW OBJECT
//DATA
// AllLocation_SCORES
