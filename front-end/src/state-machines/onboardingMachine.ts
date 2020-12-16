import { Machine, interpret, assign, spawn, sendParent} from "xstate";

export const onboardingMachine = Machine({

    id: 'onboarding',
    initial: 'loading',
    states: {
      loading: {
        on: {
          SUCCESS: 'salesPitch'
        }
      },
      salesPitch: {
        on: {
          SUCCESS: {
            actions: sendParent('STARTQUESTIONAIRE')
          },
        }
      }
    }
});