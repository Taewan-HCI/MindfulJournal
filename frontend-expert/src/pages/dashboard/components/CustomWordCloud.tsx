import React from 'react';
import WordCloud from 'react-d3-cloud';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { ResponsiveContainer } from 'recharts';

const data = [
  { text: '자살', value: 3 },
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
];

const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);

function CustomWordCloud() {
  return (
    <ResponsiveContainer width="80%" aspect={4}>
      <WordCloud
        data={data}
        width={100}
        height={100}
        fontWeight="bold"
        fontSize={(word: any) => Math.log2(word.value + 1) * 20}
        spiral="rectangular"
        rotate={(word: any) => word.value % 360}
        padding={5}
        random={Math.random}
        fill={(d: any, i: any) => schemeCategory10ScaleOrdinal(i)}
        onWordClick={(event: any, d: any) => {
          console.log(`onWordClick: ${d.text}`);
        }}
        onWordMouseOver={(event: any, d: any) => {
          console.log(`onWordMouseOver: ${d.text}`);
        }}
        onWordMouseOut={(event: any, d: any) => {
          console.log(`onWordMouseOut: ${d.text}`);
        }}
      />
    </ResponsiveContainer>
  );
}

export default CustomWordCloud;
