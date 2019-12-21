import { ICollection } from './../contracts/collection-interface';

export class Collection<T> implements ICollection<T> {
  protected items: { [index: string]: T } = {};
  private counter = 0;

  /**
   * @inheritdoc
   */
  add(key: string, value: T): void {
    if (!this.hasOwnProperty(key)) {
      this.counter++;
      this.items[key] = value;
    }
  }
  /**
   * @inheritdoc
   */
  contains(key: string): boolean {
    return this.items.hasOwnProperty(key);
  }
  /**
   * @inheritdoc
   */
  count(): number {
    return this.counter;
  }
  /**
   * @inheritdoc
   */
  get(key: string): T {
    return this.items[key];
  }
  /**
   * @inheritdoc
   */
  keys(): string[] {
    const keySet: string[] = [];
    for (const prop in this.items) {
      if (this.contains(prop)) {
        keySet.push(prop);
      }
    }
    return keySet;
  }
  /**
   * @inheritdoc
   */
  remove(key: string): T {
    if (!this.contains(key)) {
      return null;
    }
    const val = this.items[key];
    delete this.items[key];
    this.counter--;
    return val;
  }
  /**
   * @inheritdoc
   */
  values(): T[] {
    const values: T[] = [];
    for (const prop in this.items) {
      if (this.contains(prop)) {
        values.push(this.items[prop]);
      }
    }
    return values;
  }
}
