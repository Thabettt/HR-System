import mongoose from 'mongoose';
import { AppraisalCycleSchema } from '../performance/models/appraisal-cycle.schema';
import { AppraisalTemplateSchema } from '../performance/models/appraisal-template.schema';
import { AppraisalTemplateType, AppraisalRatingScaleType, AppraisalCycleStatus, AppraisalAssignmentStatus, AppraisalRecordStatus, AppraisalDisputeStatus } from '../performance/enums/performance.enums';
import { AppraisalAssignmentSchema } from '../performance/models/appraisal-assignment.schema';
import { AppraisalRecordSchema } from '../performance/models/appraisal-record.schema';
import { AppraisalDisputeSchema } from '../performance/models/appraisal-dispute.schema';

export async function seedPerformance(connection: mongoose.Connection, departments: any, employees: any) {
  const AppraisalCycleModel = connection.model('AppraisalCycle', AppraisalCycleSchema);
  const AppraisalTemplateModel = connection.model('AppraisalTemplate', AppraisalTemplateSchema);
  const AppraisalAssignmentModel = connection.model('AppraisalAssignment', AppraisalAssignmentSchema);
  const AppraisalRecordModel = connection.model('AppraisalRecord', AppraisalRecordSchema);
  const AppraisalDisputeModel = connection.model('AppraisalDispute', AppraisalDisputeSchema);

  console.log('Clearing Performance Data...');
  await AppraisalCycleModel.deleteMany({});
  await AppraisalTemplateModel.deleteMany({});
  await AppraisalAssignmentModel.deleteMany({});
  await AppraisalRecordModel.deleteMany({});
  await AppraisalDisputeModel.deleteMany({});

  console.log('Seeding Performance Data...');
  const template = await AppraisalTemplateModel.create({
    name: 'Annual Review Template 2025',
    description: 'Standard annual review template',
    templateType: AppraisalTemplateType.ANNUAL,
    isActive: true,
    ratingScale: {
      type: AppraisalRatingScaleType.FIVE_POINT,
      min: 1,
      max: 5,
      step: 1,
      labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
    },
    sections: [
      {
        key: 'core_values',
        title: 'Core Values',
        weight: 50,
        criteria: [
          { key: 'integrity', title: 'Integrity', weight: 50 },
          { key: 'teamwork', title: 'Teamwork', weight: 50 },
        ],
      },
      {
        key: 'goals',
        title: 'Goals',
        weight: 50,
        criteria: [
          { key: 'goal_achievement', title: 'Goal Achievement', weight: 100 },
        ],
      },
    ],
  });

  const cycle = await AppraisalCycleModel.create({
    name: '2025 Annual Review Cycle',
    description: 'Performance review for the year 2025',
    cycleType: AppraisalTemplateType.ANNUAL,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    status: AppraisalCycleStatus.ACTIVE,
    templates: [
      {
        templateId: template._id,
        departmentIds: [departments.hrDept._id, departments.engDept._id, departments.salesDept._id],
      },
    ],
  });
  console.log('Performance Data seeded.');

  console.log('Seeding Appraisal Assignments...');
  const assignment = await AppraisalAssignmentModel.create({
    cycleId: cycle._id,
    templateId: template._id,
    employeeProfileId: employees.alice._id,
    managerProfileId: employees.alice._id, // Self-manager for demo
    departmentId: departments.hrDept._id,
    status: AppraisalAssignmentStatus.IN_PROGRESS,
    dueDate: new Date('2025-12-31'),
  });
  console.log('Appraisal Assignments seeded.');

  console.log('Seeding Appraisal Records...');
  const record = await AppraisalRecordModel.create({
    assignmentId: assignment._id,
    employeeProfileId: employees.alice._id,
    managerProfileId: employees.alice._id, // Self-manager for demo
    templateId: template._id,
    cycleId: cycle._id,
    status: AppraisalRecordStatus.DRAFT,
    overallRating: 4,
    ratings: [
      { key: 'integrity', title: 'Integrity', ratingValue: 5 },
      { key: 'teamwork', title: 'Teamwork', ratingValue: 4 },
      { key: 'goal_achievement', title: 'Goal Achievement', ratingValue: 4 },
    ],
  });
  console.log('Appraisal Records seeded.');

  console.log('Seeding Appraisal Disputes...');
  await AppraisalDisputeModel.create({
    _id: new mongoose.Types.ObjectId(),
    appraisalId: record._id,
    assignmentId: assignment._id,
    raisedByEmployeeId: employees.alice._id,
    cycleId: cycle._id,
    reason: 'I believe my teamwork rating should be higher.',
    status: AppraisalDisputeStatus.OPEN,
  });
  console.log('Appraisal Disputes seeded.');
}
