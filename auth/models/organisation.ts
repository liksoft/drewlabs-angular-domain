import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializableBuilder, ISerializer } from '../../built-value/contracts/serializers';
import { RessourcesWallet } from './wallet';

export class OrganisationBuilder implements ISerializableBuilder<OrganisationEntity> {
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


}

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
}
