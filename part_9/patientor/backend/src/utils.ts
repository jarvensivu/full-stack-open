import {
  NewPatient,
  Gender,
  EntryWithoutId,
  Diagnosis,
  HealthCheckRating,
  SickLeave,
} from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isEmptyString = (text: string): boolean => {
  return text.trim().length === 0;
};

const parseData = (data: unknown, name: string): string => {
  if (!isString(data)) {
    throw new Error(`Incorrect data in field: '${name}'`);
  }

  if (isEmptyString(data)) {
    throw new Error(`Missing value in field: '${name}'`);
  }

  return data;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender)) {
    throw new Error("Incorrect data in field: 'gender'");
  }

  if (isEmptyString(gender)) {
    throw new Error("Missing value in field: 'gender'");
  }

  switch (gender) {
    case "male":
      return Gender.Male;
    case "female":
      return Gender.Female;
    case "other":
      return Gender.Other;
    default:
      throw new Error(`Unknown gender: '${gender}'`);
  }
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object) {
    throw new Error("Missing patient data");
  }
  if (typeof object !== "object"){
    throw new Error("Patient data is in incorrect format. Patient data must be an object");
  }

  if (!("name" in object))
    throw new Error("Incorrect data: a 'name' field missing");
  if (!("ssn" in object))
    throw new Error("Incorrect data: a 'ssn' field missing");
  if (!("occupation" in object))
    throw new Error("Incorrect data: a 'occupation' field missing");
  if (!("dateOfBirth" in object))
    throw new Error("Incorrect data: a 'date of birth' field missing");
  if (!("gender" in object))
    throw new Error("Incorrect data: a 'gender' field missing");

  const newPatient: NewPatient = {
    name: parseData(object.name, "name"),
    ssn: parseData(object.ssn, "ssn"),
    occupation: parseData(object.occupation, "occupation"),
    dateOfBirth: parseData(object.dateOfBirth, "dateOfBirth"),
    gender: parseGender(object.gender),
    entries: [],
  };

  return newPatient;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [] as Array<Diagnosis["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (typeof rating !== "number") {
    throw new Error("Incorrect data in field: 'healthCheckRating'. Data must be a number number");
  }

  if (rating < 0 || rating > 3) {
    throw new Error("Health check rating is out of range. Rating must be between 0 and 3");
  }

  return rating;
};

const parseSickLeave = (object: object): SickLeave | undefined => {
  if (
    "sickLeave" in object &&
    object.sickLeave !== null &&
    typeof object.sickLeave === "object" &&
    "startDate" in object.sickLeave &&
    "endDate" in object.sickLeave
  ) {
    return {
      startDate: parseData(object.sickLeave.startDate, "sick leave start date"),
      endDate: parseData(object.sickLeave.endDate, "sick leave end date"),
    };
  }
  return undefined;
};

export const toEntry = (object: unknown): EntryWithoutId => {
  if (!object) {
    throw new Error("Missing entry data");
  }
  if (typeof object !== "object") {
    throw new Error("Entry data is in incorrect format. Entry data must be an object");
  }

  if (!("description" in object))
    throw new Error("Incorrect data: a 'description' field missing");
  if (!("date" in object))
    throw new Error("Incorrect data: a 'date' field missing");
  if (!("specialist" in object))
    throw new Error("Incorrect data: a 'specialist' field missing");
  if (!("diagnosisCodes" in object))
    throw new Error("Incorrect data: a 'diagnosisCodes' field missing");
  if (!("type" in object))
    throw new Error("Incorrect data: a 'type' field missing");

  const newEntry = {
    description: parseData(object.description, "description"),
    date: parseData(object.date, "date"),
    specialist: parseData(object.specialist, "specialist"),
    diagnosisCodes: parseDiagnosisCodes(object),
  };

  switch (object.type) {
    case "HealthCheck":
      if (!("healthCheckRating" in object)) {
        throw new Error("Incorrect data: a 'healthCheckRating' field missing");
      }
      return {
        ...newEntry,
        type: object.type,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
      };
    case "Hospital":
      if (!("discharge" in object)) {
        throw new Error("Incorrect data: a 'healthCheckRating' field missing");
      }
      if (typeof object.discharge !== "object" || object.discharge === null) {
        throw new Error("Incorrect data: a 'discharge' field must be an object");
      }
      if (!("date" in object.discharge)) {
        throw new Error("Incorrect data: a 'date' field missing");
      }
      if (!("criteria" in object.discharge)) {
        throw new Error("Incorrect data: a 'criteria' field missing");
      }

      return {
        ...newEntry,
        type: object.type,
        discharge: {
          date: parseData(object.discharge.date, "discharge date"),
          criteria: parseData(object.discharge.criteria, "discharge criteria"),
        },
      };
    case "OccupationalHealthcare":
      if (!("employerName" in object)) {
        throw new Error("Incorrect data: a 'employerName' field missing");
      }
      return {
        ...newEntry,
        type: object.type,
        employerName: parseData(object.employerName, "employerName"),
        sickLeave: parseSickLeave(object),
      };
    default:
      throw new Error(`Unknown entry type: '${object.type}'`);
  }
};
