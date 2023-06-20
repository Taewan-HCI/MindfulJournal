/* eslint-disable react/no-array-index-key */
import { PHQ_QUESTIONS } from 'constants/phq';
import React from 'react';
import { Table } from 'react-bootstrap';

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
            <td>{score < 5 ? score : '-'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default PHQTabs;
