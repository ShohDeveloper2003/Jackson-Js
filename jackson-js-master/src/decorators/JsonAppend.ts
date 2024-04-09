/**
 * @packageDocumentation
 * @module Decorators
 */

import {defineMetadata, makeJacksonDecorator} from '../util';
import {
  JsonAppendDecorator,
  JsonAppendOptions
} from '../@types';

/**
 * Decorator that may be used to add "virtual" properties to be written after regular properties
 * (although ordering may be changed using both standard {@link JsonPropertyOrder} decorator, and properties of this decorator).
 *
 * @example
 * ```typescript
 * @JsonAppend({attrs: [
 *   {
 *     value: 'version',
 *   }
 * ]})
 * class User {
 *   @JsonProperty() @JsonClassType({type: () => [Number]})
 *   id: number;
 *   @JsonProperty() @JsonClassType({type: () => [String]})
 *   email: string;
 *
 *   constructor(id: number, email: string) {
 *     this.id = id;
 *     this.email = email;
 *   }
 * }
 *
 * const user = new User(1, 'john.alfa@gmail.com');
 * const objectMapper = new ObjectMapper();
 *
 * const jsonData = objectMapper.stringify<User>(user, {
 *   attributes: {
 *     version: 1.2
 *   }
 * });
 * ```
 */
export const JsonAppend: JsonAppendDecorator = makeJacksonDecorator(
  (o: JsonAppendOptions): JsonAppendOptions => (
    {
      enabled: true,
      prepend: false,
      attrs: [],
      ...o
    }),
  (options: JsonAppendOptions, target, propertyKey, descriptorOrParamIndex) => {
    if (descriptorOrParamIndex == null && propertyKey == null) {
      defineMetadata('JsonAppend', options, target);
      return target;
    }
  });
