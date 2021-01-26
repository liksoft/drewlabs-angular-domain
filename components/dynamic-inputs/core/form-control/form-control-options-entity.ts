// import { GenericSerializaleSerializer, UndecoratedSerializer } from '../../../../built-value/core/js/serializer';

// export class ControlOption {
//   id: number = undefined;
//   table: string = undefined;
//   keyfield: string = undefined;
//   groupfield: string = undefined;
//   description: string = undefined;
//   displayLabel: string = undefined;

//   /**
//    * @description Calls to get the builder provider of the current class|type
//    */
//   static builder() {
//     return new GenericSerializaleSerializer(ControlOption, new UndecoratedSerializer);
//   }

//   static getJsonableProperties(): { [index: string]: keyof ControlOption } | { [index: string]: { name: string, type: any } } {
//     return {
//       id: 'id',
//       table: 'table',
//       keyfield: 'keyfield',
//       groupfield: 'groupfield',
//       valuefield: 'description',
//       display_label: 'displayLabel',
//     };
//   }
// }
