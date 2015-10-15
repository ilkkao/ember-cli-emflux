
import Ember from 'ember';

let localStorageSupported = typeof Storage !== 'undefined';

export default Ember.Object.extend({
    init() {
        if (localStorageSupported) {
            setInterval(function() {
                Ember.run.next(this, this._saveSnapshot);
            }.bind(this), 60 * 1000); // Once in a minute
        }
    },

    loadSnapshot() {
        if (!this.fromJSON || !localStorageSupported) {
            return;
        }

        let data;
        let name = this.get('name');

        Ember.Logger.info(`Starting to load saved snapshot: ${name}`);

        try {
            data = JSON.parse(window.localStorage.getItem(name));

            if (!data) {
                Ember.Logger.info('Snapshot not found.');
                return false;
            }

            Ember.Logger.info('Snapshot loaded.');

            if (data.userId !== this.get('userId') || data.version !== 1) {
                Ember.Logger.info('Snapshot corrupted.');
                window.localStorage.removeItem('data');
                return false;
            }

            this.fromJSON(data)

            Ember.Logger.info('Snapshot processed.');
        } catch (e) {
            Ember.Logger.info(`Failed to load or validate snapshot: ${e}`);
        }
    },

    _saveSnapshot() {
        if (!this.toJSON || !this.get('initDone')) {
            return;
        }

        let data = this.toJSON();

        try {
            window.localStorage.setItem(this.get('name'), JSON.stringify(data));
            Ember.Logger.info('Snapshot saved.');
        } catch (e) {
            Ember.Logger.info(`Failed to save snapshot: ${e}`);
        }
    }
});
