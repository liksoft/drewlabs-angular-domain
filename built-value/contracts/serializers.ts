
/**
 * @description Contract|Interface that holds informations about the object property that is decorate
 * with [[@JsonProperty()]] decorator
 */
export interface IJsonMetaData<T> {
  name?: string;
  valueType?: new () => T;
}

interface IDeserializer {
  /**
   * @description Convert a JSON encoded object into a provided class type
   * @param bluePrint [[T]] Type definition of the object to return from the deserialization operation
   * @param jsonObject [[any]] JSON formatted Object to be deserialize
   */
  deserialize<T>(bluePrint?: new () => T, jsonObject?: any): T|null|undefined;
}

export interface ISerializer extends IDeserializer{

  /**
   * @description Convert an object into a JSON formatted object
   * @param bluePrint [[T]] Type definition of the serializable object
   * @param value [[any]] Instance to be serialize
   */
  serialize<T>(bluePrint: new () => T, value: T): object|any|undefined;
}

export interface UnDecoratedObjectSerializer extends IDeserializer {
  /**
   * @description Convert an object into a JSON formatted object
   * @param value [[any]] Instance to be serialize
   */
  serialize<T>(bluePrint: new () => T, value: T): object;
}

export interface SerializableBuilder<T> {
  /**
   * @description Convert a given object of type [[T]] into a serialized value
   * @param value [[T]]
   */
  toSerialized(value: T): any;

}

export interface ISerializableBuilder<T> extends SerializableBuilder<T> {

  /**
   * @description Object that provide implementation of [[deserialize]] and [[serialize]]
   */
  readonly serializer: ISerializer;

  /**
   * @description Create an object of type [[T]] from a serialized value
   * @param serialized [[any]]
   */
  fromSerialized(serialized: object|string|any): T;
}

export interface IGenericSerializableBuilder<T> extends SerializableBuilder<T> {
  /**
   * @description Convert a given object of type [[T]] into a serialized value
   * @param type [new () => T]
   * @param value [[T]]
   */
  fromSerialized(type: new () => T, value: T): any;
}
