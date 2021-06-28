export class Authorization {
  id!: number;
  label!: string;
  displayLabel!: string;
  description!: string;
  createdAt!: string;
  updatedAt!: string;

  static getJsonableProperties(): {[index: string]: keyof Authorization}|{[index: string]: any} {
    return {
      id: 'id',
      label: 'label',
      display_label: 'displayLabel',
      description: 'description',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
    };
  }
}
