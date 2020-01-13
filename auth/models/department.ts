import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializableBuilder, ISerializer } from '../../built-value/contracts/serializers';
import { TypeBuilder, buildJSObjectType, rebuildJSObjectType } from '../../built-value/contracts/type';
import { OrganisationEntity } from './organisation';
import { IDynamicFormBindableModel } from '../../components/dynamic-inputs/core/contracts/form-control';
import { Role } from './role';

export class DepartmentBuilder implements ISerializableBuilder<Department>, TypeBuilder<Department> {
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
  fromSerialized(serialized: any): Department {
    return this.serializer.deserialize(Department, serialized);
  }

  /**
   * @inheritdoc
   */
  toSerialized(value: Department) {
    return this.serializer.serialize(Department, value);
  }

  /**
   * @inheritdoc
   */
  build(bluePrint: new () => Department, params: object): Department {
    return buildJSObjectType(bluePrint, params);
  }

  /**
   * @inheritdoc
   */
  rebuild(instance: Department, params: object | Department): Department {
    return rebuildJSObjectType(instance, params);
  }

}

export class Department implements IDynamicFormBindableModel {
  @JsonProperty('id')
  id: number = undefined;
  @JsonProperty('name')
  name: string = undefined;
  @JsonProperty('description')
  description: string = undefined;
  @JsonProperty('organisation_id')
  organisationID: string = undefined;
  @JsonProperty({name: 'organisation', valueType: OrganisationEntity})
  organisation: OrganisationEntity = undefined;

  // Related models
  @JsonProperty({name: 'roles', valueType: Role})
  roles: Role[] = undefined;

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder(): TypeBuilder<Department> | ISerializableBuilder<Department> {
    return new DepartmentBuilder();
  }

  /**
   * @inheritdoc
   */
  formViewModelBindings(): { [index: string]: any } {
    return {
      name: 'departments_name',
      departments_description: 'description',
      departments_organisation_id: 'organisation_id',
      roles: 'roles'
    };
  }
}
