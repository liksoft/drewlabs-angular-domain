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
import { Department } from '../../../models/department';
import { isDefined } from 'src/app/lib/domain/utils/type-utils';

export const DEPARTMENT_STORE = 'departments';
export const DEPARTMENT_UPDATED_ACTION = 'department_updated';
export const DEPARTMENT_REMOVED_ACTION = 'department_deleted';
export const DEPARTMENT_CONTAINERINITIALIZED_ACTION = 'roles_container_initialized';
export const DEPARTMENT_CREATED_ACTION = 'department_created';

function initDepartmentsStore(reducer: IReducer<Department>, payload: IPayload): void {
  reducer.items.next(List(initializeStoreHandler(payload.value as List<Department>)));
}

function removeDepartmentByKeyFromStore(reducer: IReducer<Department>, payload: IPayload): void {
  const values = reducer.items.getValue();
  reducer.items.next(List(removeByKeyHandler(values ? values : List([]), payload.index as string|number, payload.needle)));
}

function addDepartmentToStore(reducer: IReducer<Department>, payload: IPayload): void {
  const values = reducer.items.getValue();
  reducer.items.next(List(addToStoreHandler(values ? values : List([]), payload.value as Department)));
}

function updateDepartmentInStore(reducer: IReducer<Department>, payload: IPayload): void {
  if (!isDefined(reducer.items.getValue())) {
    return;
  }
  const items = reducer.items.getValue();
  const index = items.findIndex((value: Department) => value[payload.index] === payload.needle);
  const item = items.get(index);
  // tslint:disable-next-line: max-line-length
  reducer.items.next(List(items.set(index, (Department.builder() as TypeBuilder<Department>).rebuild(item, payload.value))));
}

export class DepartmentReducer extends AbstractReducer<Department> {

  constructor() {
    super({
      department_updated: updateDepartmentInStore,
      department_deleted: removeDepartmentByKeyFromStore,
      roles_container_initialized: initDepartmentsStore,
      department_created: addDepartmentToStore
    });
  }
  protected onStream(stream: IAction) {
    if (this.handlers.contains(stream.type)) {
      this.handlers.get(stream.type)(this, stream.payload);
    }
  }
}
