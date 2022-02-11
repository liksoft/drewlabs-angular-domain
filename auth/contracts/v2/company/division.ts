export class DivisionV2 {
  id!: number;
  label!: string;
  displayLabel!: string;
  createdAt!: string;
  updatedAt!: string;

  static getJsonableProperties(): { [index: string]: keyof DivisionV2 } | { [index: string]: any } {
    return {
      id: 'id',
      label: 'label',
      description: 'description',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
    };
  }
}
