import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Stack, CircularProgress, Typography } from "@mui/material";
import { Work, LocalHospital, HealthAndSafety, Favorite } from '@mui/icons-material';
import { Male, Female } from '@mui/icons-material';
import patientService from "../../services/patients";
import { Diagnosis, Patient, Entry, HealthCheckRating } from "../../types";
import { assertNever } from "../../utils";

interface PatientPageProps {
  diagnoses: Diagnosis[];
}

interface EntryDetailsProps {
  diagnoses: Diagnosis[];
  entry: Entry;
}

interface DiagnosisListProps {
  diagnoses: Diagnosis[];
  entry: Entry;
}

interface HealthRatingBarProps {
  rating: number;
}

const HealthRatingBar = ({ rating }: HealthRatingBarProps) => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return <Favorite style={{color: "#00cc00"}}/>;
    case HealthCheckRating.LowRisk:
      return <Favorite style={{color: "#ffff00"}}/>
    case HealthCheckRating.HighRisk:
      return <Favorite style={{color: "#ff6600"}}/>
    case HealthCheckRating.CriticalRisk:
      return <Favorite style={{color: "#ff0000"}}/>
    default:
      return null;
  }
}

const DiagnosisList = ({diagnoses, entry}: DiagnosisListProps) => {
  if (!entry.diagnosisCodes || entry.diagnosisCodes.length === 0) return null;

  return (
    <ul>
      {entry.diagnosisCodes?.map(code => (
        <li key={code}>
          {code} {diagnoses.find(diagnosis => diagnosis.code === code)?.name}
        </li>
      ))}
    </ul>
  )
}

const EntryDetails = ({ diagnoses, entry }: EntryDetailsProps ) => {
  switch (entry.type) {
    case "Hospital":
      return (
      <div>
        <Typography variant="body1">
          {entry.date} <LocalHospital />
        </Typography>
        <Typography variant="body1">
          <em>{entry.description}</em>
        </Typography>
        <Typography variant="body1">
          Discharge: {entry.discharge.date} {entry.discharge.criteria}
        </Typography>
        <DiagnosisList diagnoses={diagnoses} entry={entry} />
        <Typography variant="body1">
          diagnose by {entry.specialist}
        </Typography>
      </div>
      )
    case "HealthCheck":
      return (
        <div>
          <Typography variant="body1">
            {entry.date} <HealthAndSafety />
          </Typography>
          <Typography variant="body1">
            <em>{entry.description}</em>
          </Typography>
          <HealthRatingBar rating={entry.healthCheckRating} />
          <DiagnosisList diagnoses={diagnoses} entry={entry} />
          <Typography variant="body1">
            diagnose by {entry.specialist}
          </Typography>
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div>
          <Typography variant="body1">
            {entry.date} <Work /> {entry.employerName}
          </Typography>
          <Typography variant="body1">
            <em>{entry.description}</em>
          </Typography>
          {entry.sickLeave && (
            <Typography variant="body1">
              Sick Leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
            </Typography>
          )}
          <DiagnosisList diagnoses={diagnoses} entry={entry} />
          <Typography variant="body1">
            diagnose by {entry.specialist}
          </Typography>
        </div>
      );
    default:
      return assertNever(entry);
  }
}

const PatientPage = ({ diagnoses }: PatientPageProps) => {
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
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            entries
          </Typography>
          {patient.entries.map(entry => (
            <Stack key={entry.id} sx={{ border: 1, borderRadius: 2, padding: 2, my: 2 }}>
              <EntryDetails entry={entry} diagnoses={diagnoses} />
            </Stack>
          ))}
          {patient.entries.length === 0 && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              no entries
            </Typography>
          )}  
      </Box>
    </div>
  );
};

export default PatientPage;
