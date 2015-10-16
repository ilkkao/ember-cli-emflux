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
  stores: Ember.inject.service(),

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
  posts: null,

  init() {
    this._super();

    this.set('posts', Ember.A([]));
  },

  handleCreateTodo(params) {
    fetch('/users', {
      method: 'post',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: params.body }).then(function(response) {
        if (response.status === 200) {
          this.get('posts').push(Ember.Object.create({ body: body}))
        }
      }
    })
  }
});
```

All modules in `/stores` directory are automatically instantiated and registered as store object singletons when the Ember app starts.

`dispatch()` will call matching handler functions from all stores. `ADD_ARTICLE_COMMENT` event is handled by `handleAddArticleEvent` method.

To get the most benefits from flux architecture in Ember app:

- Don't add any logic to Ember controllers.
- Don't set any models in Ember routes.
- Use Ember actions only between child and parent component when no other component or server doesn't need to know about it. In practice you probably need Ember actions rarely.
- Don't mutate store data in components (D'oh!)

## API

### dispatcher:

#### ```dispatch(name, params, acceptCb, rejectCb)```

##### Parameters

```type``` (string, mandatory) Action name, can contain uppercase characters and underscore.

```params``` (hash, optional) Parameter hash that will be given to the action handler in the store.

```acceptCb``` (function, optional) Callback that the action handler can call if it considers the action as accepted.

```rejectedCb``` (function, optional) Callback that the action handler can call if it considers the action as rejected.

##### Return value

none

#### ```getStore(name)```

##### Parameters

```name``` (string, mandatory) Store name.

##### Return value

Store singleton object or `null` if the store doesn't exist.

#### `getAllStores()`

##### Parameters

none

##### Return value

An array containing JavaScript objects with two keys, `name` (string) and `store` (reference to singleton).

## Running Tests

* `ember test`
* `ember test --server`
