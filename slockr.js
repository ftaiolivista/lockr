(function(root, factory) {

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = factory(root, exports);
    }
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {
      root.SLockr = factory(root, exports);
    });
  } else {
    root.SLockr = factory(root, {});
  }

}(this, function(root, SLockr) {
  'use strict';

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/)
    {
      var len = this.length >>> 0;

      var from = Number(arguments[1]) || 0;
      from = (from < 0)
      ? Math.ceil(from)
      : Math.floor(from);
      if (from < 0)
        from += len;

      for (; from < len; from++)
      {
        if (from in this &&
            this[from] === elt)
          return from;
      }
      return -1;
    };
  }

  SLockr.prefix = "";

  SLockr._getPrefixedKey = function(key, options) {
    options = options || {};

    if (options.noPrefix) {
      return key;
    } else {
      return this.prefix + key;
    }

  };

  SLockr.set = function (key, value, options) {
    var query_key = this._getPrefixedKey(key, options);

    try {
      sessionStorage.setItem(query_key, JSON.stringify({"data": value}));
    } catch (e) {
      if (console) console.warn("SLockr didn't successfully save the '{"+ key +": "+ value +"}' pair, because the sessionStorage is full.");
    }
  };

  SLockr.get = function (key, missing, options) {
    var query_key = this._getPrefixedKey(key, options),
        value;

    try {
      value = JSON.parse(sessionStorage.getItem(query_key));
    } catch (e) {
            if(sessionStorage[query_key]) {
              value = {data: sessionStorage.getItem(query_key)};
            } else{
                value = null;
            }
    }
    if(value === null) {
      return missing;
    } else if (typeof value === 'object' && typeof value.data !== 'undefined') {
      return value.data;
    } else {
      return missing;
    }
  };

  SLockr.sadd = function(key, value, options) {
    var query_key = this._getPrefixedKey(key, options),
        json;

    var values = SLockr.smembers(key);

    if (values.indexOf(value) > -1) {
      return null;
    }

    try {
      values.push(value);
      json = JSON.stringify({"data": values});
      sessionStorage.setItem(query_key, json);
    } catch (e) {
      console.log(e);
      if (console) console.warn("SLockr didn't successfully add the "+ value +" to "+ key +" set, because the sessionStorage is full.");
    }
  };

  SLockr.smembers = function(key, options) {
    var query_key = this._getPrefixedKey(key, options),
        value;

    try {
      value = JSON.parse(sessionStorage.getItem(query_key));
    } catch (e) {
      value = null;
    }

    if (value === null)
      return [];
    else
      return (value.data || []);
  };

  SLockr.sismember = function(key, value, options) {
    return SLockr.smembers(key).indexOf(value) > -1;
  };

  SLockr.keys = function() {
    var keys = [];
    var allKeys = Object.keys(sessionStorage);

    if (SLockr.prefix.length === 0) {
      return allKeys;
    }

    allKeys.forEach(function (key) {
      if (key.indexOf(SLockr.prefix) !== -1) {
        keys.push(key.replace(SLockr.prefix, ''));
      }
    });

    return keys;
  };

  SLockr.getAll = function () {
    var keys = SLockr.keys();
    return keys.map(function (key) {
      return SLockr.get(key);
    });
  };

  SLockr.srem = function(key, value, options) {
    var query_key = this._getPrefixedKey(key, options),
        json,
        index;

    var values = SLockr.smembers(key, value);

    index = values.indexOf(value);

    if (index > -1)
      values.splice(index, 1);

    json = JSON.stringify({"data": values});

    try {
      sessionStorage.setItem(query_key, json);
    } catch (e) {
      if (console) console.warn("SLockr couldn't remove the "+ value +" from the set "+ key);
    }
  };

  SLockr.rm =  function (key) {
    sessionStorage.removeItem(key);
  };

  SLockr.flush = function () {
    if (SLockr.prefix.length) {
      SLockr.keys().forEach(function(key) {
        sessionStorage.removeItem(SLockr._getPrefixedKey(key));
      });
    } else {
      sessionStorage.clear();
    }
  };
  return SLockr;

}));
