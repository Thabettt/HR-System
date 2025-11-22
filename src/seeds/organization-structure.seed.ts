import mongoose from 'mongoose';
import { DepartmentSchema } from '../organization-structure/models/department.schema';
import { PositionSchema } from '../organization-structure/models/position.schema';
import { PositionAssignmentSchema } from '../organization-structure/models/position-assignment.schema';

import { StructureChangeRequestSchema } from '../organization-structure/models/structure-change-request.schema';
import { StructureChangeLogSchema } from '../organization-structure/models/structure-change-log.schema';
import { StructureApprovalSchema } from '../organization-structure/models/structure-approval.schema';
import { StructureRequestType, StructureRequestStatus, ChangeLogAction, ApprovalDecision } from '../organization-structure/enums/organization-structure.enums';

export async function seedOrganizationStructure(connection: mongoose.Connection) {
  const DepartmentModel = connection.model('Department', DepartmentSchema);
  const PositionModel = connection.model('Position', PositionSchema);
  const StructureChangeRequestModel = connection.model('StructureChangeRequest', StructureChangeRequestSchema);
  const StructureChangeLogModel = connection.model('StructureChangeLog', StructureChangeLogSchema);
  const StructureApprovalModel = connection.model('StructureApproval', StructureApprovalSchema);

  console.log('Clearing Organization Structure data...');
  await DepartmentModel.deleteMany({});
  await PositionModel.deleteMany({});
  await StructureChangeRequestModel.deleteMany({});
  await StructureChangeLogModel.deleteMany({});
  await StructureApprovalModel.deleteMany({});
  
  // 1. Create Departments
  console.log('Seeding Departments...');
  const hrDept = await DepartmentModel.create({
    code: 'HR-001',
    name: 'Human Resources',
    description: 'Handles all HR related tasks',
    isActive: true,
  });

  const engDept = await DepartmentModel.create({
    code: 'ENG-001',
    name: 'Engineering',
    description: 'Software Development and Engineering',
    isActive: true,
  });

  const salesDept = await DepartmentModel.create({
    code: 'SALES-001',
    name: 'Sales',
    description: 'Sales and Marketing',
    isActive: true,
  });
  console.log('Departments seeded.');

  // 2. Create Positions
  console.log('Seeding Positions...');
  const hrManagerPos = await PositionModel.create({
    code: 'POS-HR-MGR',
    title: 'HR Manager',
    description: 'Manager of Human Resources',
    departmentId: hrDept._id,
    isActive: true,
  });

  const softwareEngPos = await PositionModel.create({
    code: 'POS-SWE',
    title: 'Software Engineer',
    description: 'Full Stack Developer',
    departmentId: engDept._id,
    isActive: true,
  });

  const salesRepPos = await PositionModel.create({
    code: 'POS-SALES-REP',
    title: 'Sales Representative',
    description: 'Sales Representative',
    departmentId: salesDept._id,
    isActive: true,
  });
  console.log('Positions seeded.');

  return {
    departments: { hrDept, engDept, salesDept },
    positions: { hrManagerPos, softwareEngPos, salesRepPos },
  };
}

export async function seedStructureRequests(connection: mongoose.Connection, employees: any) {
  const StructureChangeRequestModel = connection.model('StructureChangeRequest', StructureChangeRequestSchema);
  const StructureChangeLogModel = connection.model('StructureChangeLog', StructureChangeLogSchema);
  const StructureApprovalModel = connection.model('StructureApproval', StructureApprovalSchema);

  if (employees && employees.alice) {
    console.log('Seeding Structure Change Requests...');
    const changeRequest = await StructureChangeRequestModel.create({
      _id: new mongoose.Types.ObjectId(),
      requestNumber: 'REQ-ORG-001',
      requestedByEmployeeId: employees.alice._id,
      requestType: StructureRequestType.NEW_DEPARTMENT,
      status: StructureRequestStatus.SUBMITTED,
      details: JSON.stringify({
        name: 'Marketing',
        code: 'MKT-001',
      }),
    });
    console.log('Structure Change Requests seeded.');

    console.log('Seeding Structure Change Logs...');
    await StructureChangeLogModel.create({
      _id: new mongoose.Types.ObjectId(),
      action: ChangeLogAction.CREATED,
      entityType: 'StructureChangeRequest',
      entityId: changeRequest._id,
      changedBy: employees.alice._id,
      changes: { status: 'SUBMITTED' },
    });
    console.log('Structure Change Logs seeded.');

    console.log('Seeding Structure Approvals...');
    await StructureApprovalModel.create({
      _id: new mongoose.Types.ObjectId(),
      changeRequestId: changeRequest._id,
      approverEmployeeId: employees.alice._id, // Self-approval for demo
      status: ApprovalDecision.PENDING,
    });
    console.log('Structure Approvals seeded.');
  }
}

export async function seedPositionAssignments(connection: mongoose.Connection, employees: any, positions: any, departments: any) {
  const PositionAssignmentModel = connection.model('PositionAssignment', PositionAssignmentSchema);
  
  console.log('Clearing Position Assignments...');
  await PositionAssignmentModel.deleteMany({});

  console.log('Seeding Position Assignments...');
  await PositionAssignmentModel.create({
    employeeProfileId: employees.alice._id,
    positionId: positions.hrManagerPos._id,
    departmentId: departments.hrDept._id,
    startDate: new Date('2020-01-01'),
  });

  await PositionAssignmentModel.create({
    employeeProfileId: employees.bob._id,
    positionId: positions.softwareEngPos._id,
    departmentId: departments.engDept._id,
    startDate: new Date('2021-05-15'),
  });

  await PositionAssignmentModel.create({
    employeeProfileId: employees.charlie._id,
    positionId: positions.salesRepPos._id,
    departmentId: departments.salesDept._id,
    startDate: new Date('2022-03-10'),
  });
  console.log('Position Assignments seeded.');
}
