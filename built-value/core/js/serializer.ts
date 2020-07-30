import { UnDecoratedObjectSerializer, IGenericSerializableBuilder } from '../../contracts/serializers';
import { deserializeJsObject, serializeJsObject } from './helper';
import { GenericTypeBuilder } from '../type-builder';
import { isDefined } from '../../../utils/types/type-utils';

export class UndecoratedSerializer implements UnDecoratedObjectSerializer {

  /**
   * @inheritdoc
   */
  deserialize = <T>(bluePrint: new () => T, serializedObject: any): T => deserializeJsObject<T>(bluePrint, serializedObject) as T;

  /**
   * @inheritdoc
   */
  serialize = <T>(value: T) => serializeJsObject(value);

}

export class GenericUndecoratedSerializaleSerializer<T> extends GenericTypeBuilder<T> implements IGenericSerializableBuilder<T> {
  serializer: UnDecoratedObjectSerializer;

  constructor() {
    super();
    this.serializer = new UndecoratedSerializer();
  }

  /**
   * @inheritdoc
   */
  fromSerialized(type: new () => T, serialized: any): T {
    if (!isDefined(serialized)) {
      return serialized;
    }
    return this.serializer.deserialize(type, serialized);
  }

  /**
   * @inheritdoc
   */
  toSerialized(value: T) {
    return this.serializer.serialize(value);
  }
}
