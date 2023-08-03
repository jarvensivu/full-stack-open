import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
//import MaleIcon from '@mui/icons-material/Male';
import { Male, Female } from '@mui/icons-material';
import patientService from "../../services/patients";
import { Patient } from "../../types";

const PatientPage = () => {
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

  console.log(id);
  console.log(patient);
  console.log(isLoading);

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
      </Box>
    </div>
  );
};

export default PatientPage;