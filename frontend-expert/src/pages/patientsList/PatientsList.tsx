/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

import { getPatientsList } from '../../apis/patients';
import ContentWithTitle from '../../components/ContentWithTitle';
import { PatientInfo } from '../../types/patient';
import PatientsInfoCard from './components/PatientsInfoCard';

function PatientsList() {
  const [patients, setPatients] = useState<PatientInfo[]>([]);

  const fetch = async () => {
    try {
      const data = await getPatientsList();
      setPatients(() => data.participants);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Container>
      <div className="fs-2 mt-2">
        <b>환자를 선택해주세요</b>
      </div>

      <ContentWithTitle title="환자 목록">
        <div className="d-flex  flex-wrap">
          {patients.map((p) => (
            <div className=" w-50 p-2" key={p.patientID}>
              <PatientsInfoCard patient={p} />
            </div>
          ))}
        </div>
      </ContentWithTitle>
    </Container>
  );
}

export default PatientsList;
