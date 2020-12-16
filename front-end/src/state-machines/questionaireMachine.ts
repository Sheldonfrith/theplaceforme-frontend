import {Machine} from 'xstate';

export const questionaireMachine = Machine({
    id: 'questionaire',
    initial: 'loading',
    states: {
        loading: {},
        inProgress: {},
        completed: {},
    }
});


const questionaireStates = {
    initial: "simpleOrComplex",
    states: {
      simpleOrComplex: {
        on: {
          SIMPLE: "tutorial",
          COMPLEX: "tutorial"
        }
      },
      tutorial: {
        on: {
          SKIP: "progressOverview",
          FINISH: "progressOverview"
        }
      },
      progressOverview: {
        on: {
          START: "categoryOverview"
        }
      },
      categoryOverview: {
        on: {
          SKIP: "categoryOverview",
          BACK: "progressOverview",
          CONTINUE: "questionIsImportant"
        }
      },
      questionIsImportant: {
        on: {
          YES: "form",
          NO: "questionIsImportant"
        }
      },
      form: {
        on: {
          ISNOTIMPORTANT: "questionIsImportant",
          COMPLETE: "questionIsImportant"
        }
      }
    }
  };