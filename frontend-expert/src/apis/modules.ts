import axiosInstance from './axiosInstance';

export async function getFrequencybyPeriod(
  patientId: string,
  startDate: number,
  endDate: number,
) {
  const { data } = await axiosInstance.get(
    `/frequency/${patientId}?start=${startDate}&end=${endDate}`,
  );
  return data;
}

export async function getLengthbyPeriod(
  patientId: string,
  startDate: number,
  endDate: number,
) {
  const { data } = await axiosInstance.get(
    `/length/${patientId}?start=${startDate}&end=${endDate}`,
  );
  return data;
}
