
// import { FormControl } from './form-control';
// import { FormViewModel } from '../contracts';
// import { DynamicFormInterface } from '../compact/types';
// import { UndecoratedSerializer, GenericSerializaleSerializer } from '../../../../built-value/core/js/serializer';

// export class Form implements FormViewModel, DynamicFormInterface {

//   id: number = undefined;
//   title: string = undefined;
//   parentId: string = undefined;
//   description: string = undefined;
//   children: Form[] = undefined;
//   formControls: FormControl[] = undefined;
//   url: string = undefined;
//   status: number = undefined;

//   /**
//    * @description Calls to get the builder provider of the current class|type
//    */
//   static builder(){
//     return new GenericSerializaleSerializer(Form, new UndecoratedSerializer);
//   }

//   static getJsonableProperties(): { [index: string]: keyof Form } | { [index: string]: { name: string, type: any } } {
//     return {
//       id: 'id',
//       title: 'title',
//       parentId: 'parentId',
//       description: 'description',
//       children: 'children',
//       formControls: 'formControls',
//       url: 'url',
//       status: 'status'
//     };
//   }

//   formViewModelBindings(): {[index: string]: any} {
//     return {
//       title: 'title',
//       description: 'description',
//       parent_id: 'parentId',
//       endpoint_url: 'url'
//     };
//   }
// }
