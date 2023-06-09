import axiosInstance from './axiosInstance';

export async function getPatientsList() {
  const { data } = await axiosInstance.get('/patient_all');
  return data;
}

export async function getPatientInfo(patientId: string) {
  const { data } = await axiosInstance.get(`/patient/${patientId}`);
  return data;
}
