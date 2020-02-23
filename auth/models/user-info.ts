import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializer, ISerializableBuilder } from '../../built-value/contracts/serializers';
import { OrganisationEntity } from './organisation';
import { TypeBuilder, buildJSObjectType, rebuildJSObjectType } from '../../built-value/contracts/type';
import { RessourcesWallet } from './wallet';
import { Agence } from './agence';

export class UserInfoBuilder implements ISerializableBuilder<UserInfoEntity>, TypeBuilder<UserInfoEntity> {

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
  fromSerialized(serialized: any): UserInfoEntity {
    return this.serializer.deserialize(UserInfoEntity, serialized);
  }

  /**
   * @inheritdoc
   */
  toSerialized(value: UserInfoEntity) {
    return this.serializer.serialize(UserInfoEntity, value);
  }

  /**
   * @inheritdoc
   */
  build(bluePrint: new () => UserInfoEntity, params: object): UserInfoEntity {
    return buildJSObjectType(bluePrint, params);
  }

  /**
   * @inheritdoc
   */
  rebuild(instance: UserInfoEntity, params: object | UserInfoEntity): UserInfoEntity {
    return rebuildJSObjectType(instance, params);
  }

}

export class UserInfoEntity {
  @JsonProperty('parent_id')
  parentId: number = undefined;
  @JsonProperty('id')
  id: number = undefined;
  @JsonProperty('firstname')
  firstname: string = undefined;
  @JsonProperty('lastname')
  lastname: string = undefined;
  @JsonProperty('address')
  address: string = undefined;
  @JsonProperty('email')
  email: string = undefined;
  @JsonProperty('other_email')
  otherEmail: string = undefined;
  @JsonProperty('phone_number')
  phoneNumber: string = undefined;
  @JsonProperty('postal_code')
  postalCode: string = undefined;
  @JsonProperty('birthdate')
  birthdate: string = undefined;
  @JsonProperty('sex')
  sex: string = undefined;
  @JsonProperty('user_id')
  userId: string = undefined;
  @JsonProperty('created_at')
  createdAt: string = undefined;
  @JsonProperty('created_at')
  updatedAt: string = undefined;
  @JsonProperty('organisation_id')
  organisationID: number = undefined;
  @JsonProperty('department_id')
  departmentID: number = undefined;
  @JsonProperty('agence_id')
  agenceID: number = undefined;
  @JsonProperty('is_manager')
  isManager: boolean = undefined;


  @JsonProperty({ name: 'organisation', valueType: OrganisationEntity })
  organisation: OrganisationEntity = undefined;
  @JsonProperty({name: 'agence', valueType: Agence})
  agence: Agence = undefined;

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder(): TypeBuilder<UserInfoEntity>|ISerializableBuilder<UserInfoEntity> {
    return new UserInfoBuilder();
  }
}
