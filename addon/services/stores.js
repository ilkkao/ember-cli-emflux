
import Ember from 'ember';
import { getAllStores } from '../emflux/dispatcher';

export default Ember.Service.extend({
    init() {
        for (let store of getAllStores()) {
            console.log(`setting ${store.name}`)
            this.set(store.name, store.store);
        }
    }
});
