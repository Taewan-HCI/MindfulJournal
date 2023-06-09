/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import WordCloud from 'react-d3-cloud';
import { Word } from 'react-d3-cloud/lib/WordCloud';
import { ResponsiveContainer } from 'recharts';

type WordCloudData = {
  text: string;
  value: number;
};

function CustomWordCloud({
  data,
  target,
  setShow,
  setCountedNum,
}: {
  data: WordCloudData[];
  target: React.MutableRefObject<HTMLDivElement | null>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setCountedNum: React.Dispatch<React.SetStateAction<number>>;
}) {
  const sensitiveWordsDict = ['자살', '자해']; // 민감한 단어를 추가해서 워드클라우드 표시 할 때 해당 단어들은 붉은 색으로 강조

  const onWordMouseOver = useCallback(
    (event: any, d: Word) => {
      // eslint-disable-next-line no-param-reassign
      target.current = event.target;
      setShow(() => true);
      setCountedNum(() => d.value);
    },
    [target, setShow, setCountedNum],
  );

  return (
    <ResponsiveContainer width="80%" aspect={4}>
      <WordCloud
        data={data}
        width={100}
        height={100}
        font="pretendard"
        fontWeight="bold"
        fontSize={(word: any) => Math.log2(word.value + 1) * 20}
        spiral="rectangular"
        rotate={(word: Word) => word.value % 360}
        padding={5}
        random={Math.random}
        fill={(d: Word) => {
          if (sensitiveWordsDict.includes(d.text)) {
            return '#dc3545';
          }
          return '#000000';
        }}
        onWordMouseOver={onWordMouseOver}
        onWordMouseOut={() => setShow(() => false)}
      />
    </ResponsiveContainer>
  );
}

export default React.memo(CustomWordCloud);
