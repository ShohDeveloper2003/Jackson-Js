import test from 'ava';
import {JsonIncludeType} from '../src/decorators/JsonInclude';
import {JsonAppend} from '../src/decorators/JsonAppend';
import {JacksonError} from '../src/core/JacksonError';
import {ObjectMapper} from '../src/databind/ObjectMapper';
import {JsonProperty} from '../src/decorators/JsonProperty';
import {JsonClassType} from '../src/decorators/JsonClassType';

test('@JsonAppend with value', t => {
  @JsonAppend({attrs: [
    {
      value: 'version',
    }
  ]})
  class User {
    @JsonProperty() @JsonClassType({type: () => [Number]})
    id: number;
    @JsonProperty() @JsonClassType({type: () => [String]})
    email: string;

    constructor(id: number, email: string) {
      this.id = id;
      this.email = email;
    }
  }

  const user = new User(1, 'john.alfa@gmail.com');
  const objectMapper = new ObjectMapper();

  const jsonData = objectMapper.stringify<User>(user, {
    attributes: {
      version: 1.2
    }
  });
  t.deepEqual(JSON.parse(jsonData), JSON.parse('{"id":1,"email":"john.alfa@gmail.com","version":1.2}'));

  const userParsed = objectMapper.parse<User>(jsonData, {mainCreator: () => [User]});
  t.assert(userParsed instanceof User);
  t.assert(!Object.hasOwnProperty.call(userParsed, 'version'));
});

test('@JsonAppend with prepend', t => {
  @JsonAppend({prepend: true, attrs: [
    {
      value: 'version',
    }
  ]})
  class User {
    @JsonProperty() @JsonClassType({type: () => [Number]})
    id: number;
    @JsonProperty() @JsonClassType({type: () => [String]})
    email: string;

    constructor(id: number, email: string) {
      this.id = id;
      this.email = email;
    }
  }

  const user = new User(1, 'john.alfa@gmail.com');
  const objectMapper = new ObjectMapper();

  const jsonData = objectMapper.stringify<User>(user, {
    attributes: {
      version: 1.2
    }
  });
  t.deepEqual(JSON.parse(jsonData), JSON.parse('{"version":1.2,"id":1,"email":"john.alfa@gmail.com"}'));

  const userParsed = objectMapper.parse<User>(jsonData, {mainCreator: () => [User]});
  t.assert(userParsed instanceof User);
  t.assert(!Object.hasOwnProperty.call(userParsed, 'version'));
});

test('@JsonAppend with userVersion', t => {
  @JsonAppend({attrs: [
    {
      value: 'version',
      propName: 'userVersion'
    }
  ]})
  class User {
    @JsonProperty() @JsonClassType({type: () => [Number]})
    id: number;
    @JsonProperty() @JsonClassType({type: () => [String]})
    email: string;

    constructor(id: number, email: string) {
      this.id = id;
      this.email = email;
    }
  }

  const user = new User(1, 'john.alfa@gmail.com');
  const objectMapper = new ObjectMapper();

  const jsonData = objectMapper.stringify(user, {
    attributes: {
      version: 1.2
    }
  });
  t.deepEqual(JSON.parse(jsonData), JSON.parse('{"id":1,"email":"john.alfa@gmail.com","userVersion":1.2}'));

  const userParsed = objectMapper.parse<User>(jsonData, {mainCreator: () => [User]});
  t.assert(userParsed instanceof User);
  t.assert(!Object.hasOwnProperty.call(userParsed, 'version'));
  t.assert(!Object.hasOwnProperty.call(userParsed, 'userVersion'));
});

test('@JsonAppend fail with value required', t => {
  @JsonAppend({attrs: [
    {
      value: 'version',
      required: true
    }
  ]})
  class User {
    @JsonProperty() @JsonClassType({type: () => [Number]})
    id: number;
    @JsonProperty() @JsonClassType({type: () => [String]})
    email: string;

    constructor(id: number, email: string) {
      this.id = id;
      this.email = email;
    }
  }

  const user = new User(1, 'john.alfa@gmail.com');
  const objectMapper = new ObjectMapper();

  const err = t.throws<JacksonError>(() => {
    objectMapper.stringify<User>(user);
  });

  t.assert(err instanceof JacksonError);
});

test('@JsonAppend include only if value is non null', t => {
  @JsonAppend({attrs: [
    {
      value: 'version',
      include: JsonIncludeType.NON_NULL
    }
  ]})
  class User {
    @JsonProperty() @JsonClassType({type: () => [Number]})
    id: number;
    @JsonProperty() @JsonClassType({type: () => [String]})
    email: string;

    constructor(id: number, email: string) {
      this.id = id;
      this.email = email;
    }
  }

  const user = new User(1, 'john.alfa@gmail.com');
  const objectMapper = new ObjectMapper();

  const jsonDataWithNull = objectMapper.stringify<User>(user, {
    attributes: {
      version: null
    }
  });
  t.deepEqual(JSON.parse(jsonDataWithNull), JSON.parse('{"id":1,"email":"john.alfa@gmail.com"}'));

  const userParsedWithNull = objectMapper.parse<User>(jsonDataWithNull, {mainCreator: () => [User]});
  t.assert(userParsedWithNull instanceof User);
  // @ts-ignore
  t.is(userParsedWithNull.version, undefined);

  const jsonDataWithValue = objectMapper.stringify<User>(user, {
    attributes: {
      version: 1.2
    }
  });
  t.deepEqual(JSON.parse(jsonDataWithValue), JSON.parse('{"id":1,"email":"john.alfa@gmail.com","version":1.2}'));

  const userParsedWithValue = objectMapper.parse<User>(jsonDataWithNull, {mainCreator: () => [User]});
  t.assert(userParsedWithValue instanceof User);
  t.assert(!Object.hasOwnProperty.call(userParsedWithValue, 'version'));
});
