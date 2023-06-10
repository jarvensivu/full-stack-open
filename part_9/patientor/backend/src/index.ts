import express from 'express';
import cors from 'cors';
import diagnoseRouter from './routes/diagnoses';
import patientRouter from './routes/patients';
import pingRouter from './routes/ping';

const app = express();

const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));

app.use(express.json());

const PORT = 3001;

app.use("/api/diagnoses", diagnoseRouter);
app.use("/api/patients", patientRouter);
app.use("/api/ping", pingRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
