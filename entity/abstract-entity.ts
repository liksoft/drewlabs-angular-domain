import { Filtrable } from 'src/app/lib/domain/contracts/filtrable';
import { IEntity } from 'src/app/lib/domain/entity';
import { ICollection } from 'src/app/lib/domain/contracts/collection-interface';
import { Collection } from 'src/app/lib/domain/utils/collection';

export abstract class AbstractEntity implements IEntity, Filtrable {

  protected fillables = [];

  /**
   * @inheritdoc
   */
  toMap(): object | ICollection<any> {
    const collection = new Collection<any>();
    this.fillables.forEach(value => {
      collection.add(value, this[value]);
    });
    return collection;
  }

  /**
   * @inheritdoc
   */
  fromEntries(entry: object) {
    for (const [k, v] of Object.entries(entry)) {
      if (this.fillables.indexOf(k) !== -1) {
        this[k] = v;
      }
    }
    return this;
  }
  /**
   * @inheritdoc
   */
  getEntityKey(): string {
    return 'id';
  }

  has(key: string, value: any): boolean {
    const item = this[key];
    return (item.toString() as string).includes(value);
  }
}
