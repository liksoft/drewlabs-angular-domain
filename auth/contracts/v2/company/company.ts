
export class Company {
  id: number = undefined;
  name: string = undefined;
  phoneNumber: string = undefined;
  address: string = undefined;
  postalCode: string = undefined;

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
