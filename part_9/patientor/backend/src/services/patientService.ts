import { v1 as uuid } from 'uuid';
import patientData from '../../data/patients';
import { NewPatient, NonSensitivePatient, Patient } from '../types';

const removeSensitiveData = (patient: Patient): NonSensitivePatient => {
  const { id, name, dateOfBirth, gender, occupation } = patient;
  return { id, name, dateOfBirth, gender, occupation };
};

const getNonSensitivePatientData = (): Array<NonSensitivePatient> => {
  return patientData.map(patient => removeSensitiveData(patient));
};

const addPatient = (newPatient : NewPatient): Patient => {
  const patient : Patient = {
    id: uuid(),
    ...newPatient
  };
  patientData.push(patient);
  return patient;
};

export default {
  getNonSensitivePatientData,
  addPatient
};
