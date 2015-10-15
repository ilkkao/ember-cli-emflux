
import Ember from 'ember';
import Resolver from 'ember/resolver';

const noopCb = () => {};

let myResolver = Resolver.create();
let failure = false;
let stores = [];

for (let module of Object.keys(require.entries)) {
    let [ firstLevel, secondLevel, thirdLevel ] = module.split('/');

    if (secondLevel === 'stores') {
        let storeClass = require(module)['default'];
        let store = storeClass.create();
        let name = thirdLevel;

        stores.push({
            store: store,
            name: name
        });

        store.loadSnapshot();

        Ember.Logger.info(`[${name}-store] Registered.`);
    }
}

export function dispatch(type, data = {}, acceptCb = noopCb, rejectCb = noopCb) {
    let consumed = false;
    let name = type.split('_').map(part => part.toLowerCase().capitalize()).join('');
    let handler = `handle${name}`;

    for (let store of stores) {
        let storeObj = store.store;

        if (storeObj[handler]) {
            consumed = true;
            storeObj[handler].call(storeObj, data, acceptCb, rejectCb);
            Ember.Logger.info(`[ACT] ${type}`);
            break;
        }
    }

    if (!consumed) {
        Ember.Logger.error(`No store handled action: ${type}`);
    }
}

export function getStore(name) {
    for (let store of stores) {
        if (store.name === name) {
            return store.store;
        }
    }

    return null;
}

export function getAllStores() {
    return stores;
}

// TODO: run.next() is probably not needed

Ember.run.next(this, function() { // Give ember time to start
    if (!failure) {
        dispatch('START');
    }
});
