import { useState, SyntheticEvent } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { EntryFormValues, EntryType } from "../../types";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const AddEntryForm = ({onSubmit, onCancel}: Props) => {
  const [type, setType] = useState<string>(EntryType.HealthCheck);
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [specialist, setSpecialist] = useState<string>("");
  const [healthCheckRating, setHealthCheckRating] = useState<string>("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string>("");

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    switch (type) {
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
        throw new Error("Not implemented");
      case EntryType.OccupationalHealthcare:
        throw new Error("Not implemented");
      default:
        throw new Error("Unknown entry type");
      }
  };

  return (
    <Box sx={{ border: "2px dashed grey", borderRadius: 2, padding: 2, mt: 2 }}>
      <Typography variant="h6">Add new entry</Typography>
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
        <TextField
          sx={{ my: 1 }}
          label="Health check rating"
          variant="standard"
          fullWidth
          value={healthCheckRating}
          onChange={({ target }) => setHealthCheckRating(target.value)}
        />
        <TextField
          sx={{ my: 1 }}
          label="Diagnosis codes"
          variant="standard"
          fullWidth
          value={diagnosisCodes}
          onChange={({ target }) => setDiagnosisCodes(target.value)}
        />
        <Grid sx={{pb: 4}}>
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
