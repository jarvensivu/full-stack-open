import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Male, Female } from '@mui/icons-material';
import patientService from "../../services/patients";
import { Diagnosis, Patient } from "../../types";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<Patient>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patient = await patientService.getById(id);
        setPatient(patient);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
    fetchPatient();
  }, [id]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!patient) {
    return (
      <div>
        <Box sx={{ mt: 4 }} >
          <Typography variant="h5">
            Patient not found
          </Typography>
        </Box>
      </div>
    )
  }

  return (
    <div>
        <Box sx={{ mt: 4 }} >
          <Typography variant="h5" sx={{ mb: 3 }}>
            {patient.name}
            {patient.gender === "male" && <Male />}
            {patient.gender === "female" && <Female />}
          </Typography>
          <Typography variant="body1">
            ssn: {patient.ssn}
          </Typography>
          <Typography variant="body1">
            occupation: {patient.occupation}
          </Typography>
          <Typography variant="h6" sx={{ mt: 3 }}>
            entries
          </Typography>
          {patient.entries.map(entry => (
            <div key={entry.id}>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {entry.date} <em>{entry.description}</em>
              </Typography>
              <ul>
                {entry.diagnosisCodes?.map(code => (
                  <li key={code}>
                    {code} {diagnoses.find(diagnosis => diagnosis.code === code)?.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {patient.entries.length === 0 && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              No entries
            </Typography>
          )}  
      </Box>
    </div>
  );
};

export default PatientPage;