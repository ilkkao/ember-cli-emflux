# Ember-cli-emflux

[Flux](https://facebook.github.io/flux/) library for Ember

[![Build Status](https://secure.travis-ci.org/ilkkao/ember-cli-emflux.png)](http://travis-ci.org/ilkkao/ember-cli-emflux)

## Installation

`npm install --save-dev ember-cli-emflux`

or

`ember install ember-cli-emflux`

## Introduction

pods/components/main/component.js:

```js
import Ember from 'ember';
import { dispatch } from 'emflux/dispatcher';

export default Ember.Component.extend({
  // Get (read) access to all stores
  stores: Ember.inject.service(),

  // Expose posts collection from todos store
  posts: Ember.computed.oneWay('stores.todos.posts'),

  newPost: '',

  actions: {
    newTodoPost() {
      dispatch('CREATE_TODO', { body: this.get('newPost') });
      this.set('newPost', '');
    }
  }
});
```

pods/components/main/template.hbs:

```js
{{#each posts key="id" as |post|}}
    <p>{{post.body}}</p>
{{/each}}

{{input value=newPost action="newTodoTpost"}}

```

stores/todos.js:

```js
import Ember from 'ember';
import Store from 'emflux/store';

export default Store.extend({
  // Posts collection, an array of post models. Stores are singletons,
  // array doesn't need to be initialized in init().
  posts: Ember.A([]),

  handleCreateTodo(params) {
    fetch('/users', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: params.body }).then(function(response) {
        if (response.status === 200) {
          // Server accepted the new post. Add it to the collection.
          this.get('posts').push(Ember.Object.create({ body: body}))
        }
      }
    })
  }
});
```

All modules in `/stores` directory are automatically instantiated and registered as store object singletons when the Ember app starts.

`dispatch()` will call matching handler functions from all stores. For example, `ADD_ARTICLE_COMMENT` event is handled by `handleAddArticleEvent` method.

To get the most benefits from flux architecture in Ember app:

- Don't add any logic to Ember controllers.
- Don't set any models in Ember routes. Instead only dispatch route change event from them. This event should update current route state that is kept in one of the stores. Then access models through `stores` service that is available for all components. Other objects (including other stores) can access a store using dispatcher `getStore` function.
- Use Ember actions only between child and parent component when no other component or server doesn't need to know about it. In practice you probably need Ember actions rarely.
- Don't mutate store data in components (D'oh!) Only event handlers in stores are allowed to mutate store models.

An example store structure of a real-world Ember app is [available](https://github.com/ilkkao/mas/tree/master/client/app/stores)

## Status

This library has been recently extracted from [a sizeable Ember app](https://github.com/ilkkao/mas). For the time being, before 1.0.0 release, API should be considered unstable between releases.

## API

### dispatcher:

#### ```dispatch(name, params, acceptCb, rejectCb)```

Dispatch an event that stores can process.

##### Parameters

```type``` (string, mandatory) Action name, can contain uppercase characters and underscore.

```params``` (hash, optional) Parameter hash that will be given to the action handler in the store.

```acceptCb``` (function, optional) Callback that the action handler can call if it considers the action as accepted.

```rejectedCb``` (function, optional) Callback that the action handler can call if it considers the action as rejected.

##### Return value

none

#### ```getStore(name)```

Get a store singleton object. Note that `getStore()` can't be called from other store's `init()` as initialization order of the stores is not guaranteed.

##### Parameters

```name``` (string, mandatory) Store name.

##### Return value

Store singleton object or `null` if the store doesn't exist.

#### `getAllStores()`

##### Parameters

none

##### Return value

An array containing JavaScript objects with two keys, `name` (string) and `store` (reference to singleton).

## Serialization and snapshotting

*This is an experimental feature.*

If a store implements both `toJSON()` and `fromJSON(object)` methods, emflux will enable snapshotting. `toJSON` method gets then called once in a minute. Object it returns is run through JSON.stringify() and saved to a local storage. Then later when the app is restarted, emflux will fetch the saved local storage snapshot and pass JSON parsed object to `fromJSON()` which then restores the store state. The data you want to persist is defined by the `toJSON()` method, it can be whole or partial store state.

Currently this feature can be used to make the app to start faster.

## Running Tests

* `ember test`
* `ember test --server`
