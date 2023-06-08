/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PatientInfo } from '../../../types/patient';
import './style.css';

export default function PatientsInfoCard({
  patient,
}: {
  patient: PatientInfo;
}) {
  return (
    <Link
      to={`/dashboard/${patient.patientID}`}
      style={{ textDecoration: 'none' }}
    >
      <Card border="light" className="p-2 hover-card">
        <Card.Body>
          <Card.Title>
            {patient.name}
            <span className="text-secondary fs-6">
              ({patient.gender}/{patient.age})
            </span>
          </Card.Title>
          <div className="d-flex align-items-center py-2">
            <div className="text-secondary">최근 진료일: </div>
            <div className="fs-6 me-2 text-secondary ms-1">
              {patient.recentVisitedDay[0]}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}
