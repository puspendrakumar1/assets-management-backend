import { ClientContactPersons } from './client-contact-person.type';

export const ClientBranch = {
  location: String,
  address: String,
  gstIN: String,
  contactPersons: [ClientContactPersons],
};
