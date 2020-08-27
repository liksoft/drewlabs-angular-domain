import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializableBuilder, ISerializer } from '../../built-value/contracts/serializers';
import { RessourcesWallet } from './wallet';
import { TypeBuilder, buildJSObjectType, rebuildJSObjectType } from '../../built-value/contracts/type';

/**
 * @deprecated
 */
export class OrganisationBuilder implements ISerializableBuilder<OrganisationEntity>, TypeBuilder<OrganisationEntity> {
  serializer: ISerializer;

  /**
   *
   */
  constructor() {
    this.serializer = new ObjectSerializer();
  }

  /**
   * @inheritdoc
   */
  fromSerialized(serialized: any): OrganisationEntity {
    return this.serializer.deserialize(OrganisationEntity, serialized);
  }

  /**
   * @inheritdoc
   */
  toSerialized(value: OrganisationEntity) {
    return this.serializer.serialize(OrganisationEntity, value);
  }

  /**
   * @inheritdoc
   */
  build(bluePrint: new () => OrganisationEntity, params: object): OrganisationEntity {
    return buildJSObjectType(bluePrint, params);
  }

  /**
   * @inheritdoc
   */
  rebuild(instance: OrganisationEntity, params: object | OrganisationEntity): OrganisationEntity {
    return rebuildJSObjectType(instance, params);
  }

}

/**
 * @deprecated
 */
export class OrganisationEntity {
  @JsonProperty('id')
  id: number = undefined;
  @JsonProperty('name')
  name: string = undefined;
  @JsonProperty('phone_number')
  phoneNumber: string = undefined;
  @JsonProperty('address')
  address: string = undefined;
  @JsonProperty('postal_code')
  postalCode: string = undefined;
  @JsonProperty({ name: 'wallet', valueType: RessourcesWallet})
  ressourcesWallet: RessourcesWallet = undefined;

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder(): TypeBuilder<OrganisationEntity> | ISerializableBuilder<OrganisationEntity> {
    return new OrganisationBuilder();
  }
}
