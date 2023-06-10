import { NewPatient, Gender } from "./types";

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
      dateOfBirth: parseData(object.dateOfBirth),
      ssn: parseData(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseData(object.occupation),
    };

    return newPatient;
  }

  throw new Error("Incorrect data: a field missing");
};
