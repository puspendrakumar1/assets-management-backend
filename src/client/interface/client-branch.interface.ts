import { IClientContactPersons } from './client-contact-person.interface';

export interface IClientBranch {
  location?: string;
  address?: string;
  gstIN?: string;
  contactPersons?: IClientContactPersons[];
}
