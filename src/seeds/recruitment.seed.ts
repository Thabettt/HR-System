import mongoose from 'mongoose';
import { JobTemplateSchema } from '../recruitment/models/job-template.schema';
import { JobRequisitionSchema } from '../recruitment/models/job-requisition.schema';
import { ApplicationSchema } from '../recruitment/models/application.schema';
import { CandidateSchema } from '../employee-profile/models/candidate.schema';
import { ApplicationStage } from '../recruitment/enums/application-stage.enum';
import { ApplicationStatus } from '../recruitment/enums/application-status.enum';
import { TerminationRequestSchema } from '../recruitment/models/termination-request.schema';
import { TerminationInitiation } from '../recruitment/enums/termination-initiation.enum';
import { OfferSchema } from '../recruitment/models/offer.schema';
import { ContractSchema } from '../recruitment/models/contract.schema';
import { OfferResponseStatus } from '../recruitment/enums/offer-response-status.enum';
import { InterviewSchema } from '../recruitment/models/interview.schema';
import { InterviewMethod } from '../recruitment/enums/interview-method.enum';
import { InterviewStatus } from '../recruitment/enums/interview-status.enum';
import { AssessmentResultSchema } from '../recruitment/models/assessment-result.schema';
import { ReferralSchema } from '../recruitment/models/referral.schema';
import { ApplicationStatusHistorySchema } from '../recruitment/models/application-history.schema';
import { ClearanceChecklistSchema } from '../recruitment/models/clearance-checklist.schema';
import { ApprovalStatus } from '../recruitment/enums/approval-status.enum';
import { DocumentSchema } from '../recruitment/models/document.schema';
import { DocumentType } from '../recruitment/enums/document-type.enum';

export async function seedRecruitment(connection: mongoose.Connection, employees: any, departments: any) {
  const JobTemplateModel = connection.model('JobTemplate', JobTemplateSchema);
  const JobRequisitionModel = connection.model('JobRequisition', JobRequisitionSchema);
  const ApplicationModel = connection.model('Application', ApplicationSchema);
  const CandidateModel = connection.model('Candidate', CandidateSchema);
  const TerminationRequestModel = connection.model('TerminationRequest', TerminationRequestSchema);
  const OfferModel = connection.model('Offer', OfferSchema);
  const ContractModel = connection.model('Contract', ContractSchema);
  const InterviewModel = connection.model('Interview', InterviewSchema);
  const AssessmentResultModel = connection.model('AssessmentResult', AssessmentResultSchema);
  const ReferralModel = connection.model('Referral', ReferralSchema);
  const ApplicationStatusHistoryModel = connection.model('ApplicationStatusHistory', ApplicationStatusHistorySchema);
  const ClearanceChecklistModel = connection.model('ClearanceChecklist', ClearanceChecklistSchema);
  const DocumentModel = connection.model('Document', DocumentSchema);

  console.log('Clearing Recruitment Data...');
  await JobTemplateModel.deleteMany({});
  await JobRequisitionModel.deleteMany({});
  await ApplicationModel.deleteMany({});
  await CandidateModel.deleteMany({});
  await TerminationRequestModel.deleteMany({});
  await OfferModel.deleteMany({});
  await ContractModel.deleteMany({});
  await InterviewModel.deleteMany({});
  await AssessmentResultModel.deleteMany({});
  await ReferralModel.deleteMany({});
  await ApplicationStatusHistoryModel.deleteMany({});
  await ClearanceChecklistModel.deleteMany({});
  await DocumentModel.deleteMany({});

  console.log('Seeding Job Templates...');
  const softwareEngineerTemplate = await JobTemplateModel.create({
    title: 'Software Engineer',
    department: 'Engineering',
    qualifications: ['BS in Computer Science'],
    skills: ['Node.js', 'TypeScript', 'MongoDB'],
    description: 'Develop and maintain software applications.',
  });

  const hrManagerTemplate = await JobTemplateModel.create({
    title: 'HR Manager',
    department: 'Human Resources',
    qualifications: ['BA in Human Resources'],
    skills: ['Communication', 'Labor Law'],
    description: 'Manage HR operations.',
  });
  console.log('Job Templates seeded.');

  console.log('Seeding Job Requisitions...');
  const seRequisition = await JobRequisitionModel.create({
    requisitionId: 'REQ-001',
    templateId: softwareEngineerTemplate._id,
    openings: 2,
    location: 'Cairo',
    hiringManagerId: employees.alice._id, // Assuming Alice is a manager
    publishStatus: 'published',
    postingDate: new Date(),
  });
  console.log('Job Requisitions seeded.');

  console.log('Seeding Candidates...');
  const candidateJohn = await CandidateModel.create({
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    nationalId: 'NAT-JOHN-001',
    candidateNumber: 'CAND-001',
    email: 'john.doe@example.com',
    phone: '1234567890',
    resumeUrl: 'http://example.com/resume.pdf',
  });
  console.log('Candidates seeded.');

  console.log('Seeding Applications...');
  const applicationJohn = await ApplicationModel.create({
    candidateId: candidateJohn._id,
    requisitionId: seRequisition._id,
    currentStage: ApplicationStage.SCREENING,
    status: ApplicationStatus.SUBMITTED,
  });
  console.log('Applications seeded.');

  console.log('Seeding Offers...');
  const offerJohn = await OfferModel.create({
    applicationId: applicationJohn._id,
    candidateId: candidateJohn._id,
    hrEmployeeId: employees.alice._id,
    grossSalary: 12000,
    role: 'Software Engineer',
    deadline: new Date(),
    applicantResponse: OfferResponseStatus.ACCEPTED,
    content: 'Offer content',
  });
  console.log('Offers seeded.');

  console.log('Seeding Contracts...');
  const contractJohn = await ContractModel.create({
    offerId: offerJohn._id,
    grossSalary: 12000,
    role: 'Software Engineer',
    acceptanceDate: new Date(),
  });
  console.log('Contracts seeded.');

  console.log('Seeding Termination Requests...');
  const terminationRequest = await TerminationRequestModel.create({
    employeeId: employees.charlie._id,
    initiator: TerminationInitiation.EMPLOYEE,
    reason: 'Found another opportunity',
    contractId: contractJohn._id,
  });
  console.log('Termination Requests seeded.');

  console.log('Seeding Referrals...');
  await ReferralModel.create({
    referringEmployeeId: employees.alice._id,
    candidateId: candidateJohn._id,
    role: 'Software Engineer',
    level: 'Mid-Senior',
  });
  console.log('Referrals seeded.');

  console.log('Seeding Interviews...');
  const interviewJohn = await InterviewModel.create({
    applicationId: applicationJohn._id,
    stage: ApplicationStage.DEPARTMENT_INTERVIEW,
    scheduledDate: new Date(),
    method: InterviewMethod.VIDEO,
    panel: [employees.alice._id],
    status: InterviewStatus.COMPLETED,
  });
  console.log('Interviews seeded.');

  console.log('Seeding Assessment Results...');
  await AssessmentResultModel.create({
    interviewId: interviewJohn._id,
    interviewerId: employees.alice._id,
    score: 85,
    comments: 'Strong technical skills, good cultural fit.',
  });
  console.log('Assessment Results seeded.');

  console.log('Seeding Application History...');
  await ApplicationStatusHistoryModel.create({
    applicationId: applicationJohn._id,
    oldStage: ApplicationStage.SCREENING,
    newStage: ApplicationStage.DEPARTMENT_INTERVIEW,
    oldStatus: ApplicationStatus.SUBMITTED,
    newStatus: ApplicationStatus.IN_PROCESS,
    changedBy: employees.alice._id,
  });
  console.log('Application History seeded.');

  console.log('Seeding Clearance Checklists...');
  await ClearanceChecklistModel.create({
    terminationId: terminationRequest._id,
    items: [
      {
        department: 'IT',
        status: ApprovalStatus.APPROVED,
        comments: 'Laptop returned',
        updatedBy: employees.alice._id,
        updatedAt: new Date(),
      },
      {
        department: 'Finance',
        status: ApprovalStatus.PENDING,
      }
    ],
    equipmentList: [
      {
        name: 'MacBook Pro',
        returned: true,
        condition: 'Good',
      }
    ],
    cardReturned: true,
  });
  console.log('Clearance Checklists seeded.');

  console.log('Seeding Documents...');
  await DocumentModel.create({
    ownerId: candidateJohn._id,
    type: DocumentType.CV,
    filePath: 'http://example.com/resume.pdf',
  });
  console.log('Documents seeded.');

  return {
    templates: { softwareEngineerTemplate, hrManagerTemplate },
    requisitions: { seRequisition },
    candidates: { candidateJohn },
    terminations: { terminationRequest },
  };
}
