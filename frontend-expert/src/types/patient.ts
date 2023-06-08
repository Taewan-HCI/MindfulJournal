export interface Patient extends PatientInfo {
  patientID: string;
}

export interface PatientInfo {
  name: string;
  gender: string;
  age: string;
  recentVisitedDay: number[];
}
