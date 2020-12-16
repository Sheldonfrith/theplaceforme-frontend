import {Machine} from 'xstate';

export const viewResultsMachine = Machine({
    id: 'viewResults',
    initial: 'loading',
    states: {
        loading: {},
        overview: {},
        detailedView: {},
    }
});