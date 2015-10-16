
import Ember from 'ember';
import { getAllStores } from '../dispatcher';

export default Ember.Service.extend({
    init() {
        for (let store of getAllStores()) {
            this.set(store.name, store.store);
        }
    }
});
