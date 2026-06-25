export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin';
  isActive: boolean;
}

export interface StudentSummary {
  studentId: string;
  name: string;
  coherence: number;
  risk: number;
  consistency: number;
  totalDecisions: number;
}
