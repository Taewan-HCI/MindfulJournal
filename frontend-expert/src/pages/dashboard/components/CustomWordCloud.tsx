/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import WordCloud from 'react-d3-cloud';
import { Word } from 'react-d3-cloud/lib/WordCloud';
import { ResponsiveContainer } from 'recharts';
import { WordCloudData } from 'types/modules';

function CustomWordCloud({
  data,
  sensitiveWords,
}: {
  data: WordCloudData[];
  sensitiveWords: string[];
}) {
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
          if (sensitiveWords.includes(d.text)) {
            return '#dc3545';
          }
          return '#000000';
        }}
      />
    </ResponsiveContainer>
  );
}

export default React.memo(CustomWordCloud);
