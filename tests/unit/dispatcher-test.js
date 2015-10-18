import { expect } from 'chai';
import { describe, it } from 'mocha';

import fixtureStore1 from './stores/fixture1'; // jshint unused:false
import fixtureStore2 from './stores/fixture2'; // jshint unused:false
import fixtureStore3 from './stores/fixture3'; // jshint unused:false

import { getAllStores } from 'emflux/dispatcher';

describe('dispatcher init', function() {
    it('all stores are instantiated', function() {
        let stores = getAllStores();
        expect(stores.length).to.equal(3);
    });
});
