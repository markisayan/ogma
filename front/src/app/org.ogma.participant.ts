import {Participant} from './org.hyperledger.composer.system';
import {Address} from './org.ogma.concept';

// export namespace org.ogma.participant{
export abstract class PhysicalEntity extends Participant {
  address: Address;
  phone: string;
  email: string;
}
export abstract class AcademicOrganisationEnitity extends PhysicalEntity {
  name: string;
  logo: string;
  websiteUrl: string;
  openingDate: Date;
  headFirstName: string;
  headLastName: string;
  managerFirstName: string;
  managerLastName: string;
}
export class Professor extends PhysicalEntity {
  professorId: string;
  firstName: string;
  photo: string;
  lastName: string;
  birthDate: Date;
  university: University;
}
export class Ministry extends AcademicOrganisationEnitity {
  ministryId: string;
}
export class University extends AcademicOrganisationEnitity {
  universityId: string;
  ministry: Ministry;
}
export class Department extends AcademicOrganisationEnitity {
  departmentId: string;
  university: University;
}
// }
