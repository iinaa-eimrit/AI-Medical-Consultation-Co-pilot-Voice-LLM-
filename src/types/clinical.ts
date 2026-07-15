export interface TranscriptUtterance {
  id: string;
  speaker: 'HCP' | 'PATIENT' | 'SYSTEM';
  text: string;
  timestamp: number; // relative milliseconds from start
  flags?: 'ADVERSE_EVENT' | 'OFF_LABEL';
}

export interface ClinicalEntity {
  name: string;
  type: 'Drug' | 'Dosage' | 'Symptom' | 'Condition';
}

export interface ActionItem {
  task: string;
  assignee: 'HCP' | 'Patient' | 'Staff';
  dueDate?: string;
}

export interface ClinicalInsights {
  entities: ClinicalEntity[];
  actionItems: ActionItem[];
  adverseEvents: string[];
  followUpDate: string;
  summary: string;
  confidenceScore: number; // 0-100
}
