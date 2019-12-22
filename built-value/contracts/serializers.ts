import 'reflect-metadata';

/**
 * @description Contract|Interface that holds informations about the object property that is decorate
 * with [[@JsonProperty()]] decorator
 */
export interface IJsonMetaData<T> {
  name?: string;
  valueType?: new () => T;
}

export interface ISerializer {

  /**
   * @description Convert a JSON encoded object into a provided class type
   * @param bluePrint [[T]] Type definition of the object to return from the deserialization operation
   * @param jsonObject [[any]] JSON formatted Object to be deserialize
   */
  deserialize<T>(bluePrint: new () => T, jsonObject: any): T;

  /**
   * @description Convert an object into a JSON formatted object
   * @param bluePrint [[T]] Type definition of the serializable object
   * @param value [[any]] Instance to be serialize
   */
  serialize<T>(bluePrint: new () => T, value: T): object|any;
}

export interface ISerializableBuilder<T> {

  /**
   * @description Object that provide implementation of [[deserialize]] and [[serialize]]
   */
  readonly serializer: ISerializer;

  /**
   * @description Create an object of type [[T]] from a serialized value
   * @param serialized [[any]]
   */
  fromSerialized(serialized: object|string|any): T;

  /**
   * @description Convert a given object of type [[T]] into a serialized value
   * @param value [[T]]
   */
  toSerialized(value: T): object|string|any;
}
