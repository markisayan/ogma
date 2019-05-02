import {Transaction} from './org.hyperledger.composer.system';
import {Department, Ministry, Professor, University} from './org.ogma.participant';

// export namespace org.ogma.participant.transaction{
export class CreateProfessor extends Transaction {
  university: University;
  firstName: string;
  lastName: string;
  photo: string;
  birthDate: Date;
  phone: string;
  email: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  countryCode: string;
  zip: string;
}

export class UpdateProfessor extends Transaction {
  professor: Professor;
  firstName: string;
  lastName: string;
  birthDate: Date;
  certificateImage: string;
  phone: string;
  email: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  countryCode: string;
  zip: string;
}

export class CreateMinistry extends Transaction {
  name: string;
  logo: string;
  phone: string;
  email: string;
  websiteUrl: string;
  openingDate: Date;
  headFirstName: string;
  headLastName: string;
  managerFirstName: string;
  managerLastName: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  countryCode: string;
  zip: string;
}

export class UpdateMinistry extends Transaction {
  ministry: Ministry;
  name: string;
  logo: string;
  phone: string;
  email: string;
  websiteUrl: string;
  openingDate: Date;
  headFirstName: string;
  headLastName: string;
  managerFirstName: string;
  managerLastName: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  countryCode: string;
  zip: string;
}

export class CreateUniversity extends Transaction {
  ministry: Ministry;
  name: string;
  logo: string;
  phone: string;
  email: string;
  websiteUrl: string;
  openingDate: Date;
  headFirstName: string;
  headLastName: string;
  managerFirstName: string;
  managerLastName: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  countryCode: string;
  zip: string;
}

export class UpdateUniversity extends Transaction {
  university: University;
  name: string;
  logo: string;
  phone: string;
  email: string;
  websiteUrl: string;
  openingDate: Date;
  headFirstName: string;
  headLastName: string;
  managerFirstName: string;
  managerLastName: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  countryCode: string;
  zip: string;
}

export class CreateDepartment extends Transaction {
  university: University;
  name: string;
  logo: string;
  phone: string;
  email: string;
  websiteUrl: string;
  openingDate: Date;
  headFirstName: string;
  headLastName: string;
  managerFirstName: string;
  managerLastName: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  countryCode: string;
  zip: string;
}

export class UpdateDepartment extends Transaction {
  department: Department;
  name: string;
  logo: string;
  phone: string;
  email: string;
  websiteUrl: string;
  openingDate: Date;
  headFirstName: string;
  headLastName: string;
  managerFirstName: string;
  managerLastName: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  countryCode: string;
  zip: string;
}

// }
