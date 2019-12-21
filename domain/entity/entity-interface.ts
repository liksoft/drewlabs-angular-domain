export interface IEntity {
  /**
   * @description Returns an object
   */
  toMap(): object;

  /**
   * @description Initialise entity from an object entries
   * @param entry [[object]] initializer
   */
  fromEntries(entry: object): IEntity;

  /**
   * @description Return the unique identifier of the entity
   */
  getEntityKey(): string;
}
