import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { CognitiveProfile } from '../models/cognitive-profile.model';
import { StudentSummary } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private currentProfile$ = new BehaviorSubject<CognitiveProfile>({
    coherence: 0.78,
    risk: 0.72,
    consistency: 0.81,
    totalDecisions: 12
  });

  private students: (StudentSummary & { email: string; isActive: boolean })[] = [
    {
      studentId: 'student_123',
      name: 'Javier Vidaurre',
      email: 'j.vidaurre@thinklab.edu.pe',
      coherence: 0.78,
      risk: 0.72,
      consistency: 0.81,
      totalDecisions: 12,
      isActive: true
    },
    {
      studentId: 'student_456',
      name: 'José Ramirez',
      email: 'j.ramirez@thinklab.edu.pe',
      coherence: 0.55,
      risk: 0.48,
      consistency: 0.62,
      totalDecisions: 8,
      isActive: true
    },
    {
      studentId: 'student_789',
      name: 'Oscar Torres',
      email: 'o.torres@thinklab.edu.pe',
      coherence: 0.32,
      risk: 0.85,
      consistency: 0.28,
      totalDecisions: 15,
      isActive: true
    },
    {
      studentId: 'student_101',
      name: 'Eduardo Milla',
      email: 'e.milla@thinklab.edu.pe',
      coherence: 0.88,
      risk: 0.25,
      consistency: 0.92,
      totalDecisions: 22,
      isActive: true
    },
    {
      studentId: 'student_202',
      name: 'Rodrigo Flores',
      email: 'r.flores@thinklab.edu.pe',
      coherence: 0.50,
      risk: 0.50,
      consistency: 0.50,
      totalDecisions: 0,
      isActive: false
    }
  ];

  getMyProfile(): Observable<CognitiveProfile> {
    return this.currentProfile$.asObservable();
  }

  getCachedProfile(): CognitiveProfile {
    return this.currentProfile$.getValue();
  }

  updateProfile(profile: CognitiveProfile) {
    this.currentProfile$.next(profile);
    // Update in students list if it's the student_123 (Javier)
    const index = this.students.findIndex(s => s.studentId === 'student_123');
    if (index !== -1) {
      this.students[index] = {
        ...this.students[index],
        coherence: profile.coherence,
        risk: profile.risk,
        consistency: profile.consistency,
        totalDecisions: profile.totalDecisions
      };
    }
  }

  getStudents(): Observable<StudentSummary[]> {
    // Return all students
    return of(this.students.map(({ email, isActive, ...rest }) => rest));
  }

  getStudentDetail(id: string): Observable<StudentSummary & { email: string; recentDecisions: number; isActive: boolean }> {
    const student = this.students.find(s => s.studentId === id) || this.students[0];
    return of({
      ...student,
      recentDecisions: student.totalDecisions > 5 ? 5 : student.totalDecisions
    });
  }
}
