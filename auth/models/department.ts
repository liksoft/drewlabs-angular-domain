import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializableBuilder, ISerializer } from '../../built-value/contracts/serializers';
import { TypeBuilder, buildJSObjectType, rebuildJSObjectType } from '../../built-value/contracts/type';
import { OrganisationEntity } from './organisation';
import { Role } from './role';
import { isDefined } from '../../utils/types/type-utils';

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
export class Department {
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
   * @description Returns the list of roles label as string
   */
  rolesToString(): string {
    if (!isDefined(this.roles)) {
      return '';
    }
    return this.roles.map((r) => r.label).join(', ');
  }

  /**
   * @inheritdoc
   */
  formViewModelBindings(): { [index: string]: any } {
    return {
      departments_name: 'name',
      departments_description: 'description',
      departments_organisation_id: 'organisationID',
      roles: 'roles'
    };
  }
}
