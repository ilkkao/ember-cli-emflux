/* jshint expr:true */

import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';

describe('dispatcher', function() {
    beforeEach(function() {
        console.log('testing');
    });

    it('two is two', function() {
        expect(2).to.equal(2);
    });
});
