# Ember-cli-emflux

Flux library for Ember

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

## API

## Running Tests

* `ember test`
* `ember test --server`
