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
import { Permission } from '../../../models/permission';

export const PERMISSIONS_STORE = 'application_permissions';
export const PERMISSION_UPDATED_ACTION = 'permission_updated';
export const PERMISSION_REMOVED_ACTION = 'permission_deleted';
export const PERMISSIONS_CONTAINERINITIALIZED_ACTION = 'permissions_container_initialized';
export const PERMISSION_CREATED_ACTION = 'permission_created';

function initPermissionsStore(reducer: IReducer<Permission>, payload: IPayload): void {
  reducer.items.next(List(initializeStoreHandler(payload.value as List<Permission>)));
}

function removePermissionByKeyFromStore(reducer: IReducer<Permission>, payload: IPayload): void {
  reducer.items.next(List(removeByKeyHandler(reducer.items.getValue(), payload.index as string|number, payload.needle)));
}

function addPermissionToStore(reducer: IReducer<Permission>, payload: IPayload): void {
  reducer.items.next(List(addToStoreHandler(reducer.items.getValue(), payload.value as Permission)));
}

function updatePermissionInStore(reducer: IReducer<Permission>, payload: IPayload): void {
  const items = reducer.items.getValue();
  const index = items.findIndex((value: Permission) => value[payload.index] === payload.needle);
  const item = items.get(index);
  // tslint:disable-next-line: max-line-length
  reducer.items.next(List(items.set(index, (Permission.builder() as TypeBuilder<Permission>).rebuild(item, payload.value))));
}

export class PermissionReducer extends AbstractReducer<Permission> {

  constructor() {
    super({
      permission_updated: updatePermissionInStore,
      permission_deleted: removePermissionByKeyFromStore,
      permissions_container_initialized: initPermissionsStore,
      permission_created: addPermissionToStore
    });
  }
  protected onStream(stream: IAction) {
    if (this.handlers.contains(stream.type)) {
      this.handlers.get(stream.type)(this, stream.payload);
    }
  }
}
