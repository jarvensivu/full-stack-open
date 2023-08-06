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

const parseData = (data: unknown): string => {
  if (!isString(data)) {
    throw new Error("Incorrect or missing data");
  }

  if (isEmptyString(data)) {
    throw new Error("Missing value");
  }

  return data;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender)) {
    throw new Error("Incorrect or missing data");
  }

  if (isEmptyString(gender)) {
    throw new Error("Missing value");
  }

  switch (gender) {
    case "male":
      return Gender.Male;
    case "female":
      return Gender.Female;
    case "other":
      return Gender.Other;
    default:
      throw new Error(`Unknown gender: ${gender}`);
  }
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newPatient: NewPatient = {
      name: parseData(object.name),
      ssn: parseData(object.ssn),
      occupation: parseData(object.occupation),
      dateOfBirth: parseData(object.dateOfBirth),
      gender: parseGender(object.gender),
      entries: []
    };

    return newPatient;
  }

  throw new Error("Incorrect data: a field missing");
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [] as Array<Diagnosis["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!isString(rating)) {
    throw new Error("Incorrect or missing data");
  }

  if (isEmptyString(rating)) {
    throw new Error("Missing value");
  }

  if (typeof rating !== "number") {
    throw new Error("Health check rating is not a number");
  }

  if (rating < 0 || rating > 3) {
    throw new Error("Health check rating is out of range");
  }

  return rating;
};

const parseSickLeave = (object: unknown): SickLeave | undefined => {
  if (
    object &&
    typeof object === "object" &&
    "sickLeave" in object &&
    object.sickLeave !== null &&
    typeof object.sickLeave === "object" &&
    "startDate" in object.sickLeave &&
    "endDate" in object.sickLeave
  ) {
    return {
      startDate: parseData(object.sickLeave.startDate),
      endDate: parseData(object.sickLeave.endDate),
    };
  }
  return undefined;
};

export const toEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    !("description" in object) ||
    !("date" in object) ||
    !("specialist" in object) ||
    !("diagnosisCodes" in object) ||
    !("type" in object)
  ) {
    throw new Error("Incorrect data: a field missing");
  }

  const newEntry = {
    description: parseData(object.description),
    date: parseData(object.date),
    specialist: parseData(object.specialist),
    diagnosisCodes: parseDiagnosisCodes(object),
  };

  switch (object.type) {
    case "HealthCheck":
      if (!("healthCheckRating" in object)) {
        throw new Error("Incorrect data: a field missing");
      }
      return {
        ...newEntry,
        type: object.type,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
      };
    case "Hospital":
      if (
        !("discharge" in object) ||
        typeof object.discharge !== "object" ||
        object.discharge === null ||
        !("date" in object.discharge) ||
        !("criteria" in object.discharge)
      ) {
        throw new Error("Incorrect data: a field missing");
      }
      return {
        ...newEntry,
        type: object.type,
        discharge: {
          date: parseData(object.discharge.date),
          criteria: parseData(object.discharge.criteria),
        },
      };
    case "OccupationalHealthcare":
      if (!("employerName" in object)) {
        throw new Error("Incorrect data: a field missing");
      }
      return {
        ...newEntry,
        type: object.type,
        employerName: parseData(object.employerName),
        sickLeave: parseSickLeave(object),
      };
    default:
      throw new Error(`Unknown entry type: ${object.type}`);
  }
};
