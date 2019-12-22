import * as Validator from 'email-validator';

export class EmailValidator {
  public static validate(email: string): boolean {
    return Validator.validate(email);
  }
}
