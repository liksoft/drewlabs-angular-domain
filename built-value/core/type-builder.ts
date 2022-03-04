import { TypeBuilder, buildJSObjectType, rebuildJSObjectType } from '../contracts/type';

export class GenericTypeBuilder<T> implements TypeBuilder<T> {

  /**
   * @inheritdoc
   */
  build(bluePrint: new () => T, params: object): T {
    return buildJSObjectType(bluePrint, params) as any;
  }

  /**
   * @inheritdoc
   */
  rebuild(instance: T, params: object | T): T {
    return rebuildJSObjectType(instance, params);
  }
}
