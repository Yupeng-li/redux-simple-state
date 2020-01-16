import { createSelector } from 'reselect';
import ld from 'lodash';

const actions = {
    'string': [
        {
            name: 'set',
            params: ['value'],
            reducer: (state, action) => action.value,
        }],
    'number': [
        {
            name: 'set',
            params: ['value'],
            reducer: (state, action) => action.value,
        }],
    'boolean': [
        {
            name: 'set',
            params: ['value'],
            reducer: (state, action) => action.value,
        },
        {
            name: 'update',
            params: ['value'],
            reducer: (state, action) => Object.assign({ ...state }, action.value),
        }],
    'object': [
        {
            name: 'set',
            params: ['value'],
            reducer: (state, action) => action.value,
        },
        {
            name: 'update',
            params: ['value'],
            reducer: (state, action) => Object.assign({}, state, action.value),
        }],
    'array': [
        {
            name: 'set',
            params: ['value'],
            reducer: (state, action) => action.value,
        },
        {
            name: 'updateItem',
            params: ['query', 'value'],
            reducer: (state, action) =>
            {
                return state.map(item =>
                {
                    if (action.query(item))
                    {
                        if (typeof item === 'object')
                            return Object.assign({}, item, action.value);
                        else return action.value;
                    }
                    return item;
                });
            },
        },
        {
            name: 'deleteItem',
            params: ['query'],
            reducer: (state, action) =>
            {
                if (typeof action.query !== 'function')
                    throw new TypeError(
                        `deleteItem expects a function as the parameter, but it received a ${typeof action.query}`,
                    );
                return [
                    ...state.slice(0, state.findIndex(action.query)),
                    ...state.slice(state.findIndex(action.query) + 1),
                ];
            },
        },
        {
            name: 'addItem',
            params: ['item'],
            reducer: (state, action) =>
            {
                return [...state, action.item];
            },
        },
    ],
};


const selector = {
    'string': 
        {
            name: 'get',
            create: (self) =>
            {
                return state => ld.get(state, self.path);
            },
        },
    'number': 
        {
            name: 'get',
            create: (self) =>
            {
                return state => ld.get(state, self.path);
            },
        },
    'boolean': 
        {
            name: 'get',
            create: (self) =>
            {
                return state => ld.get(state, self.path);
            },
        },
    'object': 
        {
            name: 'get',
            create: (self) =>
            {
                return state => ld.get(state, self.path);
            },
        },
    'array': 
        {
            name: 'get',
            create: (self) =>
            {
                return state => ld.get(state, self.path);
            },
        }
};


export default {actions, selector}