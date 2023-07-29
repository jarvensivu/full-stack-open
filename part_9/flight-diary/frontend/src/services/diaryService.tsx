import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = "/api/diaries";

export const getAllDiaryEntries = () => {
  return axios.get<DiaryEntry[]>(baseUrl).then((response) => response.data);
};

export const addDiaryEntry = (entry: NewDiaryEntry) => {
  return axios
    .post<DiaryEntry>(baseUrl, entry)
    .then((response) => response.data);
};
