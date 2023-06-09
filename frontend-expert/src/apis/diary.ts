import axiosInstance from './axiosInstance';

export async function getDiaryList(patientId: string) {
  const { data } = await axiosInstance.get(`/diary/${patientId}`);
  return data;
}

export async function getDiary(patientId: string, diaryId: string) {
  const { data } = await axiosInstance.get(`/${patientId}/${diaryId}`);
  return data;
}

export async function getDiarybyPeriod(
  patientId: string,
  startDate: number,
  endDate: number,
) {
  const { data } = await axiosInstance.get(
    `/${patientId}?start=${startDate}&end=${endDate}`,
  );
  return data;
}
