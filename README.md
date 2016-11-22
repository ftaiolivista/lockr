![SLockr logo](http://i.imgur.com/GfLtw3Z.png)

> A minimal API wrapper for ~~localStorage~~ sessionStorage. Simple as your high-school locker.

SLockr (pronounced /ˈlɒkəʳ/) is an extremely lightweight library (<2kb when minified), designed to facilitate how you interact with sessionStorage. Saving objects and arrays, numbers or other data types, accessible via a Redis-like API. Is a sessionStorage clone of  [Dimitris Tsironis Lockr](https://github.com/tsironis/SLockr).

## How to use SLockr

In order to user SLockr, you firstly need to install it in your project.

```js
bower install slockr
```

or you use npm to install

```js
npm i slockr --save
```

or maybe download it manually hook it in your HTML.

```html
<script src="/path/to/SLockr.js" type="text/javascript"></script>
```

## API reference

```SLockr.set``` - arguments: *[ key, value ]* {String, Number, Array or Object}

> Set a key to a particular value or a hash object (```Object``` or ```Array```) under a hash key.

*Example*

```js
SLockr.set('username', 'Coyote'); // Saved as string
SLockr.set('user_id', 12345); // Saved as number
SLockr.set('users', [{name: 'John Doe', age: 18}, {name: 'Jane Doe', age: 19}]);
```

---

```SLockr.get``` - arguments: *[ key or hash_key, default value ]*

> Returns the saved value for given key, even if the saved value is hash object. If value is null or undefined it returns a default value.

*Example*
```js
SLockr.get('username');
> "Coyote"

SLockr.get('user_id');
> 12345

SLockr.get('users');
>  [{name: 'John Doe', age: 18}, {name: 'Jane Doe', age: 19}]

SLockr.get('score', 0):
> 0

SLockr.set('score', 3):
SLockr.get('score', 0):
> 3
```

---

```SLockr.rm``` - arguments: *[ key ]* {String}

> Remove a key from ```sessionStorage``` entirely.

*Example*

```js
SLockr.set('username', 'Coyote'); // Saved as string
SLockr.get('username');
> "Coyote"
SLockr.rm('username');
SLockr.get('username');
> undefined
```

---

```SLockr.sadd``` - arguments *[ key, value ]*{String, Number, Array or Object}

> Adds a unique value to a particular set under a hash key.

*Example*

```js
SLockr.sadd("wat", 1); // [1]
SLockr.sadd("wat", 2); // [1, 2]
SLockr.sadd("wat", 1); // [1, 2]
```

---

```SLockr.smembers``` - arguments *[ key ]*

> Returns the values of a particular set under a hash key.

*Example*

```js
SLockr.sadd("wat", 42);
SLockr.sadd("wat", 1337);
SLockr.smembers("wat"); // [42, 1337]
```

---

```SLockr.sismember``` - arguments *[ key, value ]*

> Returns whether the value exists in a particular set under a hash key.

*Example*

```js
SLockr.sadd("wat", 1);
SLockr.sismember("wat", 1); // true
SLockr.sismember("wat", 2); // false
```

---

```SLockr.srem``` - arguments *[ key, value ]*

> Removes a value from a particular set under a hash key.

*Example*

```js
SLockr.sadd("wat", 1);
SLockr.sadd("wat", 2);
SLockr.srem("wat", 1);
SLockr.smembers("wat"); // [2]
```

---

```SLockr.getAll``` - arguments: *null*

> Returns all saved values & objects, in an ```Array```

*Example*

```js
SLockr.getAll();
> ["Coyote", 12345, [{name: 'John Doe', age: 18}, {name: 'Jane Doe', age: 19}]]
```
---

```SLockr.flush()``` - arguments: *null*

> Empties sessionStorage().

*Example*

```js
sessionStorage.length;
> 3
SLockr.flush();
sessionStorage.length;
> 0
```
