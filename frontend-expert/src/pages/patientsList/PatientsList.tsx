import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

import { getPatientsList } from 'apis/patients';
import ContentWithTitle from 'components/ContentWithTitle';
import Skeleton from 'components/Skeleton';
import { Patient } from 'types/patient';
import PatientsInfoCard from './components/PatientsInfoCard';

function CardSkeleton() {
  return (
    <div className="w-50 p-2">
      <Skeleton backgroundColor="#f8f9fa" className="p-4">
        <Skeleton.Title className="mb-3" />
        <Skeleton.Text />
      </Skeleton>
    </div>
  );
}

function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);

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
        <div className="d-flex flex-wrap">
          {patients.length > 0 ? (
            patients.map((p) => (
              <div className="w-50 p-2" key={p.patientID}>
                <PatientsInfoCard patient={p} />
              </div>
            ))
          ) : (
            <>{Array(6).fill(<CardSkeleton />)}</>
          )}
        </div>
      </ContentWithTitle>
    </Container>
  );
}

export default PatientsList;
