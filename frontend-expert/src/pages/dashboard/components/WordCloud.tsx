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
  useEffect(() => {
    const data = [
      'Hello',
      'world',
      'normally',
      'you',
      'want',
      'more',
      'words',
      'than',
      'this',
    ];

    function end(words: any) {
      d3.select('#word-cloud')
        .append('svg')
        .attr('width', 500)
        .attr('height', 500)
        .style('border', '1px solid black')
        .append('g')
        .attr('transform', `translate(${500 / 2},${500 / 2}')`)
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-size', (d: any) => `${d.size}px`)
        .style('font-family', 'Impact')
        .attr('text-anchor', 'middle')
        .attr(
          'transform',
          (d: any) => `translate(${d.x}, ${d.y})rotate(${d.rotate})`,
        )
        .text((d: any) => d.text);
    }

    cloud()
      .size([width, height])
      .words(
        data.map((d) => ({
          text: d,
          size: 10 + Math.random() * 90,
          test: 'haha',
        })),
      )
      .padding(5)
      .font('Impact')
      .fontSize((d) => d.size ?? 0)
      .on('end', end)
      .start();
  });

  return (
    <div>
      <h1>리뷰 분석 결과</h1>
      <div id="word-cloud" />
    </div>
  );
}

export default WordCloud;
