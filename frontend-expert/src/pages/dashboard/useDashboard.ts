/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { toast } from 'react-toastify';

import { getPatientInfo } from 'apis/patients';
import { getFrequencybyPeriod, getLengthbyPeriod } from 'apis/modules';
import { getDiarybyPeriod, getDiaryList } from 'apis/diary';
import { DatetoUnixTimeStamp } from 'utils/date';
import { PatientInfo } from 'types/patient';
import { DiaryInfo } from 'types/diary';
import { ModuleData } from 'types/modules';
import { useLocation } from 'react-router-dom';
import { endOfDay, startOfDay } from 'date-fns';

interface Data {
  sessionEnd: number;
  operator: string;
  duration: number;
  length: number;
  phq9score?: number;
}

const useDashboard = () => {
  const [radioValue, setRadioValue] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<(null | Date)[]>([null, null]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [patientInfo, setPatientInfo] = useState<PatientInfo>();
  const [diaryList, setDiaryList] = useState<DiaryInfo[]>();
  const [tabData, setTabData] = useState<ModuleData>();

  const dateInfo = useRef<number[]>([]);

  const location = useLocation();
  const userId = location.pathname.split('/')[2];

  const fetchByPeriod = async (startDate: number, endDate: number) => {
    try {
      const diaryData = await getDiarybyPeriod(userId, startDate, endDate);
      const modulesData = await getLengthbyPeriod(userId, startDate, endDate);
      const frequencyData = await getFrequencybyPeriod(
        userId,
        startDate,
        endDate,
      ).then((data) => data.num.map((date: number) => new Date(date * 1000)));

      const durationdata = modulesData.diary.map((d: Data) => {
        const { sessionEnd, duration, length } = d;
        return { sessionEnd, duration, length };
      });

      const phqData = modulesData.diary.map((d: Data) => {
        const { phq9score, sessionEnd } = d;
        return { sessionEnd, phq9score };
      });

      const tab = {
        frequency: frequencyData,
        duration: durationdata,
        phqScore: phqData,
      };

      toast.success('데이터를 불러왔습니다.');

      setTabData(() => tab);
      setDiaryList(() => diaryData.diary);

      dateInfo.current = [startDate, endDate];
    } catch (error) {
      toast.error('데이터를 불러오는데 실패했습니다.');
      console.error(error);
    }
    setIsLoading(() => false);
  };

  const fetch = async () => {
    try {
      const userData = await getPatientInfo(userId);
      const diaryData = await getDiaryList(userId);

      setPatientInfo(() => userData);
      setDiaryList(() => diaryData.diary);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {}, [diaryList?.toString]);

  const onClick = () => {
    setIsLoading(() => true);
    if (dateRange[0] === null || dateRange[1] === null) {
      return;
    }
    const startDate = DatetoUnixTimeStamp(dateRange[0]);
    const endDate = DatetoUnixTimeStamp(endOfDay(dateRange[1]));

    fetchByPeriod(startDate, endDate);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const today = new Date();
    const tartgetDay = startOfDay(
      new Date(
        today.setDate(
          today.getDate() - parseInt(e.currentTarget.value, 10) + 1,
        ),
      ),
    );

    setDateRange(() => [tartgetDay, endOfDay(new Date())]);
    setRadioValue(e.currentTarget.value);
  };

  const data = useMemo(
    () => [
      { text: '자해', value: 2 },
      { text: '생각', value: 2 },
      { text: '부모님', value: 2 },
      { text: '고마운', value: 1 },
      { text: '면도', value: 1 },
      { text: '그럴', value: 1 },
      { text: '나', value: 1 },
      { text: '스스로가', value: 1 },
      { text: '한심하고', value: 1 },
      { text: '모습', value: 1 },
      { text: '남들이', value: 1 },
      { text: '더더욱', value: 1 },
      { text: '바보로', value: 1 },
      { text: '자기들은', value: 1 },
      { text: '잘났나', value: 1 },
      { text: '생각도', value: 1 },
      { text: '들지만', value: 1 },
      { text: '정작', value: 1 },
      { text: '사람들', value: 1 },
      { text: '앞에서면', value: 1 },
      { text: '한', value: 1 },
      { text: '마디도', value: 1 },
      { text: '못하니까', value: 1 },
    ],
    [],
  );

  const isDateSelected =
    radioValue !== null || (dateRange[0] !== null && dateRange[1] !== null);

  return {
    patientInfo,
    radioValue,
    onChange,
    dateRange,
    setDateRange,
    setRadioValue,
    isDateSelected,
    isLoading,
    onClick,
    diaryList,
    setDiaryList,
    tabData,
    dateInfo,
    data,
  };
};

export default useDashboard;
