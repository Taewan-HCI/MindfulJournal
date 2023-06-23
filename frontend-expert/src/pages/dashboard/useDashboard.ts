/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { toast } from 'react-toastify';

import { getPatientInfo } from 'apis/patients';
import { getFrequencybyPeriod, getLengthbyPeriod } from 'apis/modules';
import { getDiarybyPeriod, getDiaryList } from 'apis/diary';
import { DatetoUnixTimeStamp, toStringDateByFormatting } from 'utils/date';
import { PatientInfo } from 'types/patient';
import { DiaryInfo, EventTimeLine } from 'types/diary';
import { CombinedWordFrequency, ModuleData } from 'types/modules';
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
    // 리렌더링 시, dateRange가 존재하는 경우에는 featchbyPeriod로 되게 설정
    const [start, end] = dateRange;
    if (start === null || end === null) {
      fetch();
    } else {
      const startDate = DatetoUnixTimeStamp(start);
      const endDate = DatetoUnixTimeStamp(endOfDay(end));
      fetchByPeriod(startDate, endDate);
    }
  }, []);

  useEffect(() => {}, [diaryList?.toString]);

  /** 날짜를 선택하고 적용 버튼을 누르면 date에 해당하는 데이터를 fetching */
  const onClick = () => {
    setIsLoading(() => true);
    if (dateRange[0] === null || dateRange[1] === null) {
      return;
    }
    const startDate = DatetoUnixTimeStamp(dateRange[0]);
    const endDate = DatetoUnixTimeStamp(endOfDay(dateRange[1]));

    fetchByPeriod(startDate, endDate);
  };

  /** radio(n일전)을 누르면 event target에서 value를 꺼낸 다음에 n일전에 해당하는 시작일을 계산 함  */
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

  const isDateSelected =
    radioValue !== null || (dateRange[0] !== null && dateRange[1] !== null);

  const [wordCloudData, sensitiveWords, timeLineData] = useMemo(() => {
    if (diaryList === null || diaryList === undefined) {
      return [[], []];
    }

    const dangerWords: string[] = [];

    // diaryList에 있는 wordFrequency를 하나로 합쳐주는 과정
    const wordFrequency = diaryList.reduce(
      (acc: CombinedWordFrequency, cur) => {
        const wordFrequencyData = cur.wordFrequency;
        const isValidData =
          wordFrequencyData !== undefined &&
          typeof wordFrequencyData !== 'string';

        if (isValidData) {
          wordFrequencyData.forEach((frequency) => {
            const { word, count, sentiment } = frequency;

            if (sentiment === '위험') {
              dangerWords.push(word);
            }
            acc[word] = (acc[word] ?? 0) + count;
          });
        }
        return acc;
      },
      {},
    );

    const timeLine = diaryList.reduce((acc: EventTimeLine[], cur) => {
      const eventSummaryData = cur.eventSummary;
      const isValidData =
        eventSummaryData !== undefined && typeof eventSummaryData !== 'string';

      if (isValidData) {
        const eventSummary = {
          ...eventSummaryData[0],
          sessionStart: cur.sessionStart,
          date: toStringDateByFormatting(cur.sessionStart),
        };
        acc.push(eventSummary);
      }
      return acc;
    }, []);

    // wordCloud 컴포넌트는 text, value형태의 값만 허용되어 해당하는 키에 맞게 매핑
    const wordCloud = Object.keys(wordFrequency).map((key) => ({
      text: key,
      value: wordFrequency[key],
    }));

    return [wordCloud, [...new Set(dangerWords)], timeLine.reverse()];
  }, [diaryList]);

  const moduleData = { wordCloudData, sensitiveWords, timeLineData };
  const dateData = { dateRange, dateInfo, radioValue, isDateSelected };

  return {
    patientInfo,
    onChange,
    setDateRange,
    setRadioValue,
    isLoading,
    onClick,
    diaryList,
    setDiaryList,
    tabData,
    moduleData,
    dateData,
  };
};

export default useDashboard;
