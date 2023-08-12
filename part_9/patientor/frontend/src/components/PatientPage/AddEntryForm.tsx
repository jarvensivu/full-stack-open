import { useState, SyntheticEvent } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { EntryFormValues, EntryType } from "../../types";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
  entryType: EntryType | undefined;
}

const AddEntryForm = ({ onSubmit, onCancel, entryType }: Props) => {
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [specialist, setSpecialist] = useState<string>("");
  const [healthCheckRating, setHealthCheckRating] = useState<string>("");
  const [employerName, setEmployerName] = useState<string>("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState<string>("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState<string>("");
  const [dischargeDate, setDischargeDate] = useState<string>("");
  const [dischargeCriteria, setDischargeCriteria] = useState<string>("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string>("");

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    switch (entryType) {
      case EntryType.HealthCheck:
        onSubmit({
          type: EntryType.HealthCheck,
          description,
          date,
          specialist,
          healthCheckRating: Number(healthCheckRating),
          diagnosisCodes: diagnosisCodes.split(" "),
        });
        break;
      case EntryType.Hospital:
        onSubmit({
          type: EntryType.Hospital,
          description,
          date,
          specialist,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
          diagnosisCodes: diagnosisCodes.split(" "),
        });
        break;
      case EntryType.OccupationalHealthcare:
        onSubmit({
          type: EntryType.OccupationalHealthcare,
          description,
          date,
          specialist,
          employerName,
          sickLeave: {
            startDate: sickLeaveStartDate,
            endDate: sickLeaveEndDate,
          },
          diagnosisCodes: diagnosisCodes.split(" "),
        });
        break;
      default:
        throw new Error("Unknown entry type");
    }
  };

  return (
    <Box sx={{ border: "2px dashed grey", borderRadius: 2, padding: 2, mt: 2 }}>
      <Typography variant="h6">New {entryType} entry</Typography>
      <form onSubmit={addEntry}>
        <TextField
          sx={{ my: 1 }}
          label="Description"
          variant="standard"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          sx={{ my: 1 }}
          label="Date"
          variant="standard"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          sx={{ my: 1 }}
          label="Specialist"
          variant="standard"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        {entryType === EntryType.HealthCheck && (
          <TextField
            sx={{ my: 1 }}
            label="Health check rating"
            variant="standard"
            fullWidth
            value={healthCheckRating}
            onChange={({ target }) => setHealthCheckRating(target.value)}
          />
        )}
        {entryType === EntryType.OccupationalHealthcare && (
          <>
            <TextField
              sx={{ my: 1 }}
              label="Employer name"
              variant="standard"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <TextField
              sx={{ my: 1 }}
              label="Sick leave start date"
              variant="standard"
              fullWidth
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
            />
            <TextField
              sx={{ my: 1 }}
              label="Sick leave end date"
              variant="standard"
              fullWidth
              value={sickLeaveEndDate}
              onChange={({ target }) => setSickLeaveEndDate(target.value)}
            />
          </>
        )}
        {entryType === EntryType.Hospital && (
          <>
            <TextField
              sx={{ my: 1 }}
              label="Discharge date"
              variant="standard"
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <TextField
              sx={{ my: 1 }}
              label="Discharge criteria"
              variant="standard"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </>
        )}
        <TextField
          sx={{ my: 1 }}
          label="Diagnosis codes"
          variant="standard"
          fullWidth
          value={diagnosisCodes}
          onChange={({ target }) => setDiagnosisCodes(target.value)}
        />
        <Grid sx={{ pb: 4 }}>
          <Grid item>
            <Button
              color="warning"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddEntryForm;
