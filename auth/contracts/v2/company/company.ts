
export class Company {
  id!: number;
  name!: string;
  phoneNumber!: string;
  address!: string;
  postalCode!: string;

  static getJsonableProperties(): { [index: string]: keyof Company } | { [index: string]: any } {
    return {
      id: 'id',
      name: 'name',
      phone_number: 'phoneNumber',
      address: 'address',
      postal_code: 'postalCode',
    };
  }
}
