import test from 'ava';
import {JsonClassType} from '../src/decorators/JsonClassType';
import {JsonUnwrapped} from '../src/decorators/JsonUnwrapped';
import {ObjectMapper} from '../src/databind/ObjectMapper';
import {JsonProperty} from '../src/decorators/JsonProperty';
import {JsonGetter} from '../src/decorators/JsonGetter';
import {JsonSetter} from '../src/decorators/JsonSetter';

test('@JsonUnwrapped at property level', t => {
  class User {
    @JsonProperty() @JsonClassType({type: () => [Number]})
    id: number;
    @JsonProperty()
    @JsonUnwrapped()
    @JsonClassType({type: () => [Name]})
    name: Name;

    // eslint-disable-next-line no-shadow
    constructor(id: number, name: Name) {
      this.id = id;
      this.name = name;
    }

  }

  class Name {
    @JsonProperty() @JsonClassType({type: () => [String]})
    first: string;
    @JsonProperty() @JsonClassType({type: () => [String]})
    last: string;

    constructor(first: string, last: string) {
      this.first = first;
      this.last = last;
    }
  }

  const name = new Name('John', 'Alfa');
  const user = new User(1, name);

  const objectMapper = new ObjectMapper();

  const jsonData = objectMapper.stringify<User>(user);
  t.deepEqual(JSON.parse(jsonData), JSON.parse('{"id":1,"first":"John","last":"Alfa"}'));

  const userParsed = objectMapper.parse<User>(jsonData, {mainCreator: () => [User]});
  t.assert(userParsed instanceof User);
  t.assert(userParsed.name instanceof Name);
  t.is(userParsed.id, 1);
  t.is(userParsed.name.first, 'John');
  t.is(userParsed.name.last, 'Alfa');
});

test('@JsonUnwrapped at property level with prefix', t => {
  class User {
    @JsonProperty() @JsonClassType({type: () => [Number]})
    id: number;
    @JsonProperty()
    @JsonUnwrapped({prefix: 'parent-'})
    @JsonClassType({type: () => [Name]})
    name: Name;

    // eslint-disable-next-line no-shadow
    constructor(id: number, name: Name) {
      this.id = id;
      this.name = name;
    }

  }

  class Name {
    @JsonProperty() @JsonClassType({type: () => [String]})
    first: string;
    @JsonProperty() @JsonClassType({type: () => [String]})
    last: string;

    constructor(first: string, last: string) {
      this.first = first;
      this.last = last;
    }
  }

  const name = new Name('John', 'Alfa');
  const user = new User(1, name);

  const objectMapper = new ObjectMapper();

  const jsonData = objectMapper.stringify<User>(user);
  t.deepEqual(JSON.parse(jsonData), JSON.parse('{"id":1,"parent-first":"John","parent-last":"Alfa"}'));

  const userParsed = objectMapper.parse<User>(jsonData, {mainCreator: () => [User]});
  t.assert(userParsed instanceof User);
  t.assert(userParsed.name instanceof Name);
  t.is(userParsed.id, 1);
  t.is(userParsed.name.first, 'John');
  t.is(userParsed.name.last, 'Alfa');
});

test('@JsonUnwrapped at property level with suffix', t => {
  class User {
    @JsonProperty() @JsonClassType({type: () => [Number]})
    id: number;
    @JsonProperty()
    @JsonUnwrapped({suffix: '-parent'})
    @JsonClassType({type: () => [Name]})
    name: Name;

    // eslint-disable-next-line no-shadow
    constructor(id: number, name: Name) {
      this.id = id;
      this.name = name;
    }

  }

  class Name {
    @JsonProperty() @JsonClassType({type: () => [String]})
    first: string;
    @JsonProperty() @JsonClassType({type: () => [String]})
    last: string;

    constructor(first: string, last: string) {
      this.first = first;
      this.last = last;
    }
  }

  const name = new Name('John', 'Alfa');
  const user = new User(1, name);

  const objectMapper = new ObjectMapper();

  const jsonData = objectMapper.stringify<User>(user);
  t.deepEqual(JSON.parse(jsonData), JSON.parse('{"id":1,"first-parent":"John","last-parent":"Alfa"}'));

  const userParsed = objectMapper.parse<User>(jsonData, {mainCreator: () => [User]});
  t.assert(userParsed instanceof User);
  t.assert(userParsed.name instanceof Name);
  t.is(userParsed.id, 1);
  t.is(userParsed.name.first, 'John');
  t.is(userParsed.name.last, 'Alfa');
});

test('@JsonUnwrapped at property level with prefix and suffix', t => {
  class User {
    @JsonProperty() @JsonClassType({type: () => [Number]})
    id: number;
    @JsonProperty()
    @JsonUnwrapped({prefix: 'parentPrefix-', suffix: '-parentSuffix'})
    @JsonClassType({type: () => [Name]})
    name: Name;

    // eslint-disable-next-line no-shadow
    constructor(id: number, name: Name) {
      this.id = id;
      this.name = name;
    }

  }

  class Name {
    @JsonProperty() @JsonClassType({type: () => [String]})
    first: string;
    @JsonProperty() @JsonClassType({type: () => [String]})
    last: string;

    constructor(first: string, last: string) {
      this.first = first;
      this.last = last;
    }
  }

  const name = new Name('John', 'Alfa');
  const user = new User(1, name);

  const objectMapper = new ObjectMapper();

  const jsonData = objectMapper.stringify<User>(user);
  // eslint-disable-next-line max-len
  t.deepEqual(JSON.parse(jsonData), JSON.parse('{"id":1,"parentPrefix-first-parentSuffix":"John","parentPrefix-last-parentSuffix":"Alfa"}'));

  const userParsed = objectMapper.parse<User>(jsonData, {mainCreator: () => [User]});
  t.assert(userParsed instanceof User);
  t.assert(userParsed.name instanceof Name);
  t.is(userParsed.id, 1);
  t.is(userParsed.name.first, 'John');
  t.is(userParsed.name.last, 'Alfa');
});

test('@JsonUnwrapped at method level', t => {
  class User {
    @JsonProperty() @JsonClassType({type: () => [Number]})
    id: number;
    @JsonProperty()
    @JsonClassType({type: () => [Name]})
    name: Name;

    constructor(id: number) {
      this.id = id;
    }

    @JsonGetter()
    @JsonUnwrapped()
    @JsonClassType({type: () => [Name]})
    getName(): Name {
      return this.name;
    }

    @JsonSetter()
    @JsonUnwrapped()
    // eslint-disable-next-line no-shadow
    setName(@JsonClassType({type: () => [Name]}) name: Name) {
      this.name = name;
    }
  }

  class Name {
    @JsonProperty() @JsonClassType({type: () => [String]})
    first: string;
    @JsonProperty() @JsonClassType({type: () => [String]})
    last: string;

    constructor(first: string, last: string) {
      this.first = first;
      this.last = last;
    }
  }

  const name = new Name('John', 'Alfa');
  const user = new User(1);
  user.name = name;

  const objectMapper = new ObjectMapper();

  const jsonData = objectMapper.stringify<User>(user);
  t.deepEqual(JSON.parse(jsonData), JSON.parse('{"id":1,"first":"John","last":"Alfa"}'));

  const userParsed = objectMapper.parse<User>(jsonData, {mainCreator: () => [User]});
  t.assert(userParsed instanceof User);
  t.assert(userParsed.name instanceof Name);
  t.is(userParsed.id, 1);
  t.is(userParsed.name.first, 'John');
  t.is(userParsed.name.last, 'Alfa');
});
