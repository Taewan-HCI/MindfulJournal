import axiosInstance from './axiosInstance';

export async function getDiaryList(patientId: string) {
  const { data } = await axiosInstance.get(`/diary/${patientId}`);
  return data;
}

export async function getDiary(patientId: string, diaryId: string) {
  const { data } = await axiosInstance.get(`/diary/${patientId}/${diaryId}`);
  return data;
}
