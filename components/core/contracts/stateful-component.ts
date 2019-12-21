type Fn = () => void;

export interface IStatefulComponent {
  /**
   * @description Perform component initialization tasks
   */
  initState(): void;

  /**
   * @description Update component state
   */
  setState(fn: Fn): void;
}

export abstract class StatefulComponent implements IStatefulComponent {
  /**
   * @inheritdoc
   */
  abstract initState(): void;

  /**
   * @inheritdoc
   */
  setState(fn: Fn): void {
    fn();
  }
}

export interface IInitializable {
  /**
   * @description Perform component initialization tasks
   */
  init(): void;
}

export interface IDestroyableComponent {
  /**
   * @description Handle actions in this method before destroying component
   */
  destroy(): void;
}

export interface IResettableComponent {
  /**
   * @description Reset the component states[properties] to their initial values
   */
  resetState(): void;
}
