import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializer, ISerializableBuilder } from '../../built-value/contracts/serializers';
import { rebuildJSObjectType, buildJSObjectType, TypeBuilder } from '../../built-value/contracts/type';

export class RessourcesWalletBuilder implements ISerializableBuilder<RessourcesWallet>, TypeBuilder<RessourcesWallet> {
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
  fromSerialized(serialized: any): RessourcesWallet {
    return this.serializer.deserialize(RessourcesWallet, serialized);
  }

  /**
   * @inheritdoc
   */
  toSerialized(value: RessourcesWallet) {
    return this.serializer.serialize(RessourcesWallet, value);
  }

  /**
   * @inheritdoc
   */
  build(bluePrint: new () => RessourcesWallet, params: object): RessourcesWallet {
    return buildJSObjectType(bluePrint, params);
  }

  /**
   * @inheritdoc
   */
  rebuild(instance: RessourcesWallet, params: object | RessourcesWallet): RessourcesWallet {
    return rebuildJSObjectType(instance, params);
  }


}

export class RessourcesWallet {
  @JsonProperty('id')
  id: number = undefined;
  @JsonProperty('balance')
  balance: number = undefined;
  @JsonProperty('status')
  status: number = undefined;

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder(): ISerializableBuilder<RessourcesWallet> {
    return new RessourcesWalletBuilder();
  }
}
