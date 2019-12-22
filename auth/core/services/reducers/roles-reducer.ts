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
import { TypeBuilder } from '../../../../built-value/contracts/type';
import { Role } from '../../../models/role';

export const ROLES_STORE = 'application_roles';
export const ROLE_UPDATED_ACTION = 'role_updated';
export const ROLE_REMOVED_ACTION = 'role_deleted';
export const ROLES_CONTAINERINITIALIZED_ACTION = 'roles_container_initialized';
export const ROLE_CREATED_ACTION = 'role_created';

function initRolesStore(reducer: IReducer<Role>, payload: IPayload): void {
  reducer.items.next(List(initializeStoreHandler(payload.value as List<Role>)));
}

function removeRoleByKeyFromStore(reducer: IReducer<Role>, payload: IPayload): void {
  reducer.items.next(List(removeByKeyHandler(reducer.items.getValue(), payload.index as string|number, payload.needle)));
}

function addRoleToStore(reducer: IReducer<Role>, payload: IPayload): void {
  reducer.items.next(List(addToStoreHandler(reducer.items.getValue(), payload.value as Role)));
}

function updateRoleInStore(reducer: IReducer<Role>, payload: IPayload): void {
  const items = reducer.items.getValue();
  const index = items.findIndex((value: Role) => value[payload.index] === payload.needle);
  const item = items.get(index);
  // tslint:disable-next-line: max-line-length
  reducer.items.next(List(items.set(index, (Role.builder() as TypeBuilder<Role>).rebuild(item, payload.value))));
}

export class RoleReducer extends AbstractReducer<Role> {

  constructor() {
    super({
      role_updated: updateRoleInStore,
      role_deleted: removeRoleByKeyFromStore,
      roles_container_initialized: initRolesStore,
      role_created: addRoleToStore
    });
  }
  protected onStream(stream: IAction) {
    if (this.handlers.contains(stream.type)) {
      this.handlers.get(stream.type)(this, stream.payload);
    }
  }
}
