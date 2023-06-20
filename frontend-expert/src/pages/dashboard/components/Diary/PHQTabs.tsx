/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Table } from 'react-bootstrap';

import NULL_CHRACTER from 'constants/common';
import PHQ_QUESTIONS from 'constants/phqQuestions';

function PHQTabs({ scores }: { scores: number[] }) {
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
            <td>{score !== null && score < 5 ? score : NULL_CHRACTER}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default PHQTabs;
