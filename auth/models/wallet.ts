import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializer, ISerializableBuilder } from '../../built-value/contracts/serializers';

export class RessourcesWalletBuilder implements ISerializableBuilder<RessourcesWallet> {
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
