import axios from "axios";
const baseUrl = import.meta.env.VITE_API_ENDPOINT ?? '/api/persons';

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject).then((response) => response.data);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
};

const personService = { getAll, create, update, remove };

export default personService;
