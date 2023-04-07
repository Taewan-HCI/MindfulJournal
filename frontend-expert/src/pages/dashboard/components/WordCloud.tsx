import React, { useEffect } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const width = 400;
const height = 400;
type Scale = 'linear' | 'log' | 'sqrt';

type Spiral = 'archimedean' | 'rectangular';

export const initialSettings = {
  content: {
    allowNumbers: false,
    maxWords: 100,
    stemmer: null,
    stopwordsInput: '',
  },
  wordcloud: {
    colors: [
      '#1f77b4',
      '#ff7f0e',
      '#2ca02c',
      '#d62728',
      '#9467bd',
      '#8c564b',
      '#e377c2',
      '#7f7f7f',
      '#bcbd22',
      '#17becf',
    ],
    fontFamily: 'times new roman',
    fontSizes: [8, 64] as [number, number],
    padding: 1,
    rotations: undefined,
    rotationAngles: [-90, 90] as [number, number],
    spiral: 'archimedean' as Spiral,
    scale: 'linear' as Scale,
    transitionDuration: 500,
    // Non-configurable
    deterministic: true,
    enableOptimizations: true,
    enableTooltip: true,
  },
};

function WordCloud() {
  const [settings, setSettings] = useState(initialSettings);

  const { wordcloud: wordcloudSettings } = settings;

  const wordcloudCallbacks = useMemo(
    () => ({
      onWordClick: (word: any) => {
        console.log(word);
      },
    }),
    [],
  );

  const words = [{ text: 'text', value: 1 }];

  const wordcloudOptions = useMemo(
    () => ({
      ...wordcloudSettings,
    }),
    [wordcloudSettings],
  );

  return (
    <ReactWordcloud
      options={wordcloudOptions}
      words={words}
      callbacks={wordcloudCallbacks}
    />
  );
}

export default WordCloud;
