import { IAction } from 'src/app/lib/domain/store/action-interface';
import {
  IPayload,
  IReducer,
  removeByKeyHandler,
  addToStoreHandler,
  initializeStoreHandler,
  AbstractReducer
} from 'src/app/lib/domain/store';
import { List } from 'immutable';
import { User } from '../../../models/user';
import { TypeBuilder } from '../../../../built-value/contracts/type';

export const USERS_STORE = 'application_users';
export const USER_UPDATED_ACTION = 'user_updated';
export const USER_REMOVED_ACTION = 'user_deleted';
export const USERS_CONTAINERINITIALIZED_ACTION = 'users_container_initialized';
export const USER_CREATED_ACTION = 'user_created';

function initUsersStore(reducer: IReducer<User>, payload: IPayload): void {
  reducer.items.next(List(initializeStoreHandler(payload.value as List<User>)));
}

function removeUserKeyFromStore(reducer: IReducer<User>, payload: IPayload): void {
  const values = reducer.items.getValue();
  reducer.items.next(List(removeByKeyHandler(values ? values : List([]), payload.index as string|number, payload.needle)));
}

function addUserToStore(reducer: IReducer<User>, payload: IPayload): void {
  const values = reducer.items.getValue();
  reducer.items.next(List(addToStoreHandler(values ? values : List([]), payload.value as User)));
}

function updateUserInStore(reducer: IReducer<User>, payload: IPayload): void {
  const values = reducer.items.getValue();
  const items = values ? values : List([]);
  const index = items.findIndex((value: User) => value[payload.index] === payload.needle);
  const item = items.get(index);
  // tslint:disable-next-line: max-line-length
  if (item) {
    reducer.items.next(List(items.set(index, (User.builder() as TypeBuilder<User>).rebuild(item, payload.value))));
  }
}

export class ApplicationUsersReducer extends AbstractReducer<User> {

  constructor() {
    super({
      user_updated: updateUserInStore,
      user_deleted: removeUserKeyFromStore,
      users_container_initialized: initUsersStore,
      user_created: addUserToStore
    });
  }
  protected onStream(stream: IAction) {
    if (this.handlers.contains(stream.type)) {
      this.handlers.get(stream.type)(this, stream.payload);
    }
  }
}
