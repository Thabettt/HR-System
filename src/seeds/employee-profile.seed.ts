import mongoose from 'mongoose';
import { EmployeeProfileSchema } from '../employee-profile/models/employee-profile.schema';
import { EmployeeQualificationSchema } from '../employee-profile/models/qualification.schema';
import { EmployeeSystemRoleSchema } from '../employee-profile/models/employee-system-role.schema';
import { EmployeeProfileChangeRequestSchema } from '../employee-profile/models/ep-change-request.schema';
import { EmployeeStatus, ContractType, WorkType, Gender, MaritalStatus, GraduationType, SystemRole, ProfileChangeStatus } from '../employee-profile/enums/employee-profile.enums';

export async function seedEmployeeProfile(connection: mongoose.Connection, departments: any, positions: any) {
  const EmployeeProfileModel = connection.model('EmployeeProfile', EmployeeProfileSchema);
  const EmployeeQualificationModel = connection.model('EmployeeQualification', EmployeeQualificationSchema);
  const EmployeeSystemRoleModel = connection.model('EmployeeSystemRole', EmployeeSystemRoleSchema);
  const EmployeeProfileChangeRequestModel = connection.model('EmployeeProfileChangeRequest', EmployeeProfileChangeRequestSchema);

  console.log('Clearing Employee Profiles...');
  await EmployeeProfileModel.deleteMany({});
  await EmployeeQualificationModel.deleteMany({});
  await EmployeeSystemRoleModel.deleteMany({});
  await EmployeeProfileChangeRequestModel.deleteMany({});

  console.log('Seeding Employees...');
  const alice = await EmployeeProfileModel.create({
    firstName: 'Alice',
    lastName: 'Smith',
    fullName: 'Alice Smith',
    nationalId: 'NAT-ALICE-001',
    employeeNumber: 'EMP-001',
    dateOfHire: new Date('2020-01-01'),
    workEmail: 'alice@company.com',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.hrManagerPos._id,
    primaryDepartmentId: departments.hrDept._id,
  });

  const bob = await EmployeeProfileModel.create({
    firstName: 'Bob',
    lastName: 'Jones',
    fullName: 'Bob Jones',
    nationalId: 'NAT-BOB-002',
    employeeNumber: 'EMP-002',
    dateOfHire: new Date('2021-05-15'),
    workEmail: 'bob@company.com',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.MARRIED,
    primaryPositionId: positions.softwareEngPos._id,
    primaryDepartmentId: departments.engDept._id,
  });

  const charlie = await EmployeeProfileModel.create({
    firstName: 'Charlie',
    lastName: 'Brown',
    fullName: 'Charlie Brown',
    nationalId: 'NAT-CHARLIE-003',
    employeeNumber: 'EMP-003',
    dateOfHire: new Date('2022-03-10'),
    workEmail: 'charlie@company.com',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.PART_TIME_CONTRACT,
    workType: WorkType.PART_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.salesRepPos._id,
    primaryDepartmentId: departments.salesDept._id,
  });
  console.log('Employees seeded.');

  console.log('Seeding Employee Qualifications...');
  await EmployeeQualificationModel.create({
    employeeProfileId: alice._id,
    establishmentName: 'University of Tech',
    graduationType: GraduationType.BACHELOR,
  });
  console.log('Employee Qualifications seeded.');

  console.log('Seeding Employee System Roles...');
  await EmployeeSystemRoleModel.create({
    employeeProfileId: alice._id,
    roles: [SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN],
  });
  console.log('Employee System Roles seeded.');

  console.log('Seeding Employee Profile Change Requests...');
  await EmployeeProfileChangeRequestModel.create({
    requestId: 'REQ-PROF-001',
    employeeProfileId: alice._id,
    requestDescription: 'Update phone number',
    status: ProfileChangeStatus.PENDING,
  });
  console.log('Employee Profile Change Requests seeded.');

  return { alice, bob, charlie };
}
