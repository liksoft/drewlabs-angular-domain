import 'reflect-metadata';
import { isArray, isPrimitive, isDefined } from '../../utils/types/type-utils';
import { IJsonMetaData, ISerializer } from '../contracts/serializers';

/**
 * @description A key use to retrieve json metadata from Reflect package
 */
const jsonMetadataKey = 'jsonProperty';

/**
 * @description Get the design type of a property of a given object at runtime
 * @param target [[any]]
 * @param propertyKey [[string]]
 */
export function getValueDesignType(target: any, propertyKey: string): any {
  return Reflect.getMetadata('design:type', target, propertyKey);
}

/**
 * @description Get the json property mapped to the property of a given object
 * @param target [[any]]
 * @param propertyKey [[string]]
 */
export function getJsonProperty<T>(target: any, propertyKey: string): IJsonMetaData<T> {
  return Reflect.getMetadata(jsonMetadataKey, target, propertyKey);
}

/**
 * @description Decorator function that helps in mapping json key to the decorated property
 * @param metadata [[IJsonMetaData<T> | string]]
 */
export function JsonProperty<T>(metadata?: IJsonMetaData<T> | string): any {
  if (metadata instanceof String || typeof metadata === 'string') {
    return Reflect.metadata(jsonMetadataKey, {
      name: metadata,
      valueType: undefined
    });
  } else {
    const metadataObj = metadata as IJsonMetaData<T>;
    return Reflect.metadata(jsonMetadataKey, {
      name: metadataObj ? metadataObj.name : undefined,
      valueType: metadataObj ? metadataObj.valueType : undefined
    });
  }
}

export class ObjectSerializer implements ISerializer {

  /**
   * @inheritdoc
   */
  deserialize = <T>(bluePrint: new () => T, jsonObject: any) => {
    // Checks if the Class blueprint is undefined
    if ((bluePrint === undefined) || (jsonObject === undefined)) {
      return undefined;
    }
    // Creates an instance of the bluprint
    const obj = new bluePrint();
    // Loop through the property of the object instance
    Object.keys(obj).forEach((key) => {
      const propertyMetaDataFn: (v: IJsonMetaData<T>) => any = (metadata) => {
        const propertyName = metadata.name || key;
        const innerJson = jsonObject ? jsonObject[propertyName] : undefined;
        const designType = getValueDesignType(obj, key);
        // Checks if the object type at design time is array
        if (isArray(designType)) {
          // Get the json property that is mapped to the object key
          const jsonMetaData = getJsonProperty<T>(obj, key);
          if (jsonMetaData.valueType || isPrimitive(designType)) {
            // If it has an inner json and the innerJson is an array apply the deserialisation on the innerJson
            if (innerJson && isArray(innerJson)) {
              return innerJson.map(
                (item) => this.deserialize(jsonMetaData.valueType, item)
              );
              // Else the type is incorrectly formed
            } else {
              return undefined;
            }
            // Else return the inner json
          } else {
            return innerJson;
          }
          // If designType is a primitive type deserialize it value
        } else if (!isPrimitive(designType)) {
          return this.deserialize(designType, innerJson);
        } else {
          return jsonObject ? jsonObject[propertyName] : undefined;
        }
      };

      const propertyMetadata = getJsonProperty<T>(obj, key);
      if (propertyMetadata) {
        obj[key] = propertyMetaDataFn(propertyMetadata);
      } else {
        if (jsonObject && jsonObject[key] !== undefined) {
          obj[key] = jsonObject[key];
        }
      }
    });
    return obj;
  }

  /**
   * @inheritdoc
   */
  serialize<T>(bluePrint: new () => T, value: T): object {
    // Checks if the Class blueprint is undefined
    if ((value === undefined)) {
      return undefined;
    }
    // Creates an instance of the bluprint
    const $serialized: object = {};
    // const obj = value.constructor || new bluePrint();
    bluePrint = bluePrint ? bluePrint : value.constructor as any;
    const obj = new bluePrint();
    Object.keys(value).forEach((key) => {
      const metadata = getJsonProperty<T>(obj, key);
      if (metadata) {
        const entryKey = metadata.name ? metadata.name : key;
        const designType = getValueDesignType(obj, key);
        if (isArray(designType)) {
          // tslint:disable-next-line: max-line-length
          $serialized[entryKey] = isDefined(value[key]) ? (value[key] as Array<any>).map((k) => {
            if (typeof metadata.valueType === 'undefined') {
              return value;
            }
            return this.serialize(metadata.valueType, k);
          }) : null;
        } else if (!isPrimitive(designType)) {
          $serialized[entryKey] = this.serialize(designType, value[key]);
        } else {
          $serialized[entryKey] = value[key];
        }
      } else {
        $serialized[key] = value && isDefined(value[key]) ? value[key] : null;
      }
    });
    return $serialized;
  }
}
