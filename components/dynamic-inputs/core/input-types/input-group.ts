import { InputInterface } from '../types';

export interface InputGroup extends InputInterface {
  children: InputInterface[];
}
