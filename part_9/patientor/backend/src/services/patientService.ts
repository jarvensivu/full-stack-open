import { v1 as uuid } from 'uuid';
import patientData from '../../data/patients';
import { NewPatient, NonSensitivePatient, Patient, EntryWithoutId } from '../types';

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

const getPatient = (id: string): Patient | undefined => {
  return patientData.find(patient => patient.id === id);
};

const addPatientEntry = (id: string, entry: EntryWithoutId): Patient | undefined => {
  const entryId = uuid();
  const newEntry = { ...entry, id: entryId };
  const patient = patientData.find(patient => patient.id === id);
  if (patient) {
    patient.entries.push(newEntry);
  }
  return patient;
};

export default {
  getNonSensitivePatientData,
  addPatient,
  getPatient,
  addPatientEntry
};
