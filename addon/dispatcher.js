
import Ember from 'ember';

const noopCb = () => {};

let dispatcherOnline = false;
let stores = [];
let pendingActions = [];

init();

export function dispatch(type, data = {}, acceptCb = noopCb, rejectCb = noopCb) {
    let consumed = false;
    let name = type.split('_').map(part => part.toLowerCase().capitalize()).join('');
    let handler = `handle${name}`;

    if (!dispatcherOnline) {
        pendingActions.push({ type: type, data: data, acceptCb: acceptCb, rejectCb: rejectCb });
        return;
    }

    for (let store of stores) {
        let storeObj = store.store;

        if (storeObj[handler]) {
            consumed = true;

            let noLog = storeObj[handler].call(storeObj, data, acceptCb, rejectCb);

            if (!noLog) {
                Ember.Logger.info(`[${store.name}-store] Consumed action ${type}.`);
            }
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

function init() {
    for (let module of Object.keys(require.entries)) {
        let [ firstLevel, secondLevel, thirdLevel ] = module.split('/');

        if (secondLevel === 'stores') {
            let storeClass = require(module)['default'];

            if (!storeClass || typeof storeClass.create !== "function") {
                break;
            }

            let name = thirdLevel;
            let store = storeClass.create({ _storeName: name });

            stores.push({
                store: store,
                name: name
            });

            Ember.Logger.info(`[${name}-store] Registered.`);
        }

        dispatcherOnline = true;

        for (let action of pendingActions) {
            dispatch(action.type, action.data, action.acceptCb, action.rejectCb);
        }

        pendingActions.clear();
    }
}
