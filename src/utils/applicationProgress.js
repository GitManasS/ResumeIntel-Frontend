export const STAGE_PROGRESS = {
  applied: 12,
  screening: 28,
  shortlisted: 42,
  technical_interview: 58,
  hr_interview: 72,
  offer: 88,
  hired: 100,
  rejected: 100,
};

export const ACTIVE_STAGES = [
  'applied',
  'screening',
  'shortlisted',
  'technical_interview',
  'hr_interview',
  'offer',
];

export const INTERVIEW_STAGES = ['technical_interview', 'hr_interview'];

export function isTerminalStage(stage) {
  return stage === 'hired' || stage === 'rejected';
}

export function isInProgress(stage) {
  return stage && !isTerminalStage(stage);
}
