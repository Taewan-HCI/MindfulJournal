/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Table } from 'react-bootstrap';

import NULL_CHRACTER from 'constants/common';
import PHQ_QUESTIONS from 'constants/phqQuestions';

/** PHQ Scores를 정리한 Table */
function PHQTabs({ scores }: { scores: number[] }) {
  // 점수가 null이 아니거나 5 이하의 숫자에 해당되면 true를 반환
  const isValidateScore = (score: number | null) => score !== null && score < 5;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Question</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((score, index) => (
          <tr key={`${score}-${index}`}>
            <td>{PHQ_QUESTIONS[index]}</td>
            <td>{isValidateScore(score) ? score : NULL_CHRACTER}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default PHQTabs;
