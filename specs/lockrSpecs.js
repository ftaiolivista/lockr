afterEach(function() {
  sessionStorage.clear();
});

describe('SLockr.set', function  () {
  it('saves a key-value pair in the sessionStorage', function () {
    SLockr.set('test', 123);

    expect(sessionStorage.getItem('test')).toEqual('{"data":123}');
  });

  it('should save a hash object in the sessionStorage', function () {
    SLockr.set('my_hash', {"test": 123, "hey": "whatsup"});

    expect(sessionStorage.getItem('my_hash')).toContain('data');
    expect(sessionStorage.getItem('my_hash')).toContain('test');
    expect(sessionStorage.getItem('my_hash')).toContain('123');
    expect(sessionStorage.getItem('my_hash')).toContain('hey');
    expect(sessionStorage.getItem('my_hash')).toContain('whatsup');
  });
});

describe('SLockr.get', function () {
  beforeEach(function() {
    SLockr.set('test', 123);
    SLockr.sadd('array', 2);
    SLockr.sadd('array', 3);
    SLockr.set('hash', {"test": 123, "hey": "whatsup"});
    sessionStorage.nativemethod = 'NativeMethod'
    SLockr.set('valueFalse', false)
    SLockr.set('value0', 0)
  });

  it('returns the value for the given key from the sessionStorage', function () {
    var value = SLockr.get('test');

    expect(value).toEqual(123);
  });

  it('returns undefined for a non-existent key', function() {
    var value = SLockr.get('something');

    expect(value).not.toBeNull();
    expect(value).toBeUndefined();
  });

  it('returns the value for the given key from the sessionStorage which set by native method', function () {
    var value = SLockr.get('nativemethod');

    expect(value).toEqual('NativeMethod');
  });

  it('returns the value for the given key from the sessionStorage which equals false', function () {
    var value = SLockr.get('valueFalse');

    expect(value).toEqual(false);
  });

  it('returns the value for the given key from the sessionStorage which equals 0', function () {
    var value = SLockr.get('value0');

    expect(value).toEqual(0);
  });

  it('gets SLockr keys', function() {
    SLockr.flush();
    SLockr.set('one', 1);
    SLockr.set('two', 2);
    SLockr.set('three', 3);
    SLockr.set('four', 4);

    var keys = SLockr.keys();

    expect(keys.length).toBe(4);
    expect(keys).toContain('one', 'two', 'three', 'four');
  });

  it('gets all contents of the sessionStorage', function () {
    var contents = SLockr.getAll();

    expect(contents.length).toBe(6);
    expect(contents).toContain({"test": 123, "hey": "whatsup"});
    expect(contents).toContain(123);
    expect(contents).toContain([2, 3]);
  });

  describe('with pre-existing data', function() {
    beforeEach(function() {
      sessionStorage.setItem('wrong', ',fluffy,truffly,commas,hell');
      sessionStorage.setItem('unescaped', 'a " double-quote');
    });

    it("if it's not a json we get as-is", function () {
      var wrongData = SLockr.get("wrong");
      expect(wrongData).toBe(',fluffy,truffly,commas,hell');
    });

    it('works with unescaped characters', function () {
      var unescaped = SLockr.get('unescaped');
      expect(unescaped).toBe('a " double-quote');
    });
  });
});

describe('SLockr.rm', function () {
  beforeEach(function() {
    SLockr.set('test', 123);
    SLockr.sadd('array', 2);
    SLockr.sadd('array', 3);
    SLockr.set('hash', {"test": 123, "hey": "whatsup"});
  });

  it('removes succesfully a key-value pair', function() {
    var oldContents = SLockr.getAll();
    expect(oldContents.length).toBe(3);

    SLockr.rm('test');
    expect(SLockr.get('test')).toBeUndefined();

    var contents = SLockr.getAll();
    expect(contents.length).toBe(2);
  });
});

describe('SLockr.flush', function  () {
  beforeEach(function() {
    SLockr.set('test', 123);
    SLockr.sadd('array', 2);
    SLockr.sadd('array', 3);
    SLockr.set('hash', {"test": 123, "hey": "whatsup"});
  });

  it('clears all contents of the sessionStorage', function () {
    var oldContents = SLockr.getAll();
    expect(oldContents.length).not.toBe(0);

    SLockr.flush();

    var contents = SLockr.getAll();
    expect(contents.length).toBe(0);
  });
});

describe('Sets', function() {
  beforeEach(function() {
    SLockr.sadd('test_set', 1);
    SLockr.sadd('test_set', 2);
  });

  describe('SLockr.sadd', function () {
    it('saves a set under the given key in the sessionStorage', function () {
      SLockr.sadd('a_set', 1);
      SLockr.sadd('a_set', 2);

      expect(sessionStorage.getItem('a_set')).toEqual('{"data":[1,2]}');
    });

    it('does not add the same value again', function() {
      SLockr.sadd('test_set', 1);
      SLockr.sadd('test_set', 2);
      SLockr.sadd('test_set, 1');

      expect(SLockr.smembers('test_set')).toEqual([1, 2]);
    });
  });

  describe('SLockr.smembers', function() {
    it('returns all the values for given key', function() {
      expect(SLockr.smembers('test_set')).toEqual([1, 2]);
    });
  });

  describe('Lock.sismember', function() {
    it('returns true if the value exists in the given set(key)', function () {
      expect(SLockr.sismember('test_set', 1)).toEqual(true);
      expect(SLockr.sismember('test_set', 34)).toEqual(false);
    });
  });

  describe('Lock.srem', function() {
    it('removes value from collection if exists', function() {
      SLockr.srem('test_set', 1);
      expect(SLockr.sismember('test_set', 1)).toEqual(false);
    });
  });
});

describe('SLockr::Prefixed', function() {
  it('should set a prefix', function() {
    SLockr.prefix = "imaprefix";
    expect(SLockr.prefix).toEqual("imaprefix");
  });
  it('should return a correctly prefixed key', function() {
    expect(SLockr._getPrefixedKey('lalala')).toEqual('imaprefixlalala');
  });
  it('should return a non-prefixed key', function() {
    expect(SLockr._getPrefixedKey('lalala', {noPrefix: true})).toEqual("lalala");
  });
  it('should save a key-value pair, prefixed', function() {
    SLockr.set("justlikeyou", true);
    expect("imaprefixjustlikeyou" in sessionStorage).toEqual(true);
  });
  it('gets SLockr keys (with prefix)', function() {
    SLockr.flush();

    sessionStorage.setItem('zero', 0);
    SLockr.set('one', 1);
    SLockr.set('two', 2);
    SLockr.set('three', 3);
    SLockr.set('four', 4);

    var keys = SLockr.keys();

    expect(keys.length).toBe(4);
    expect(keys).toContain('one', 'two', 'three', 'four');
  });

  describe('SLockr.flush', function  () {
    it('clears all contents of the sessionStorage with prefix', function () {
      sessionStorage.setItem('noprefix', false);
      SLockr.set('test', 123);
      SLockr.sadd('array', 2);
      SLockr.sadd('array', 3);
      SLockr.set('hash', {"test": 123, "hey": "whatsup"});

      var oldContents = SLockr.getAll();
      var keys = Object.keys(sessionStorage);

      expect(oldContents.length).not.toBe(0);
      expect(keys).toContain('noprefix')
      SLockr.flush();
      expect(keys).toContain('noprefix')

      var contents = SLockr.getAll();
      expect(contents.length).toBe(0);
    });
  });


});
