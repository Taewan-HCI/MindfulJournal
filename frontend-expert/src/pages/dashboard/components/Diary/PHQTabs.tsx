/* eslint-disable react/no-array-index-key */
import { PHQ_QUESTIONS } from 'constants/phq';
import React from 'react';
import { Table } from 'react-bootstrap';

function PHQTabs() {
  const data = [1, 1, 3, 2, 1, 1, 1, 1, 1];
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Question</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {data.map((score, index) => (
          <tr key={`${score}-${index}`}>
            <td>{PHQ_QUESTIONS[index]}</td>
            <td>{score}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default PHQTabs;
