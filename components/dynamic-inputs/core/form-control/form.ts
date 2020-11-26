import { JsonProperty, ObjectSerializer } from 'src/app/lib/domain/built-value/core/serializers';
import { ISerializableBuilder } from 'src/app/lib/domain/built-value/contracts/serializers';
import { TypeBuilder } from 'src/app/lib/domain/built-value/contracts/type';
import { FormControl } from './form-control';
import { ArrayUtils, isArray } from '../../../../utils';
import { FormViewModel } from '../contracts';
import { DynamicFormInterface } from '../compact/types';
import { GenericSerializaleSerializer } from 'src/app/lib/domain/built-value/core/js/serializer';

/**
 * @description Sort form loaded from backend server by control index
 * @param f [[Form]]
 */
export function sortFormFormControlsByIndex(f: Form): DynamicFormInterface {
  if (isArray(f.formControls) && (f.formControls as Array<FormControl>).length > 0) {
    f.formControls = ArrayUtils.sort((f.formControls as Array<FormControl>), 'controlIndex', 1) as FormControl[];
  }
  return f;
}
export class Form implements FormViewModel, DynamicFormInterface {
  @JsonProperty('id')
  id: number = undefined;
  @JsonProperty('title')
  title: string = undefined;
  @JsonProperty('parentId')
  parentId: string = undefined;
  @JsonProperty('description')
  description: string = undefined;
  @JsonProperty({name: 'children', valueType: Form})
  children: Form[] = undefined;
  @JsonProperty({name: 'formControls', valueType: FormControl})
  formControls: FormControl[] = undefined;
  @JsonProperty('url')
  url: string = undefined;
  @JsonProperty('status')
  status: number = undefined;

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder(): TypeBuilder<DynamicFormInterface> | ISerializableBuilder<DynamicFormInterface> {
    return new GenericSerializaleSerializer(Form, new ObjectSerializer());
  }

  formViewModelBindings(): {[index: string]: any} {
    return {
      title: 'title',
      description: 'description',
      parent_id: 'parentId',
      endpoint_url: 'url'
    };
  }
}
