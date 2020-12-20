import { Machine, interpret, assign, spawn, Actor } from "xstate";

const SubMachine = Machine({
  id: "sub",
  initial: "initialSub",
  context: {
    sub: 10
  },
  states: {
    initialSub: {
      on: {
        TEST: "newState"
      }
    },
    newState: {
      on: {
        TEST2: {
          target: "initialSub",
          actions: assign({ sub: () => 1 })
        },
        TEST3: {
          actions: assign({ sub: () => 40 })
        }
      }
    }
  }
});


const TestMachine = Machine({
  id: "test",
  initial: "initial",
  context: {
    contextVal: "3",
    contextVal2: 4,
    SubMachine: null
  },
  states: {
    initial: {
      entry: assign({
        SubMachine: (_) => spawn(SubMachine, { autoForward: true, sync: true })
      })
    }
  }
});

export const service = interpret(TestMachine, { devTools: false }).onTransition(
  (state) => {
    console.log(state.value);
  }
);

service.start();
const testVar = service.state.context.SubMachine.state;

console.log("testVar now", testVar);
setTimeout(async () => {
  await service.state.context.SubMachine.send("TEST3");
  console.log("testvar after timeout:", testVar);
}, 2000);
