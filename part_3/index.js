const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

morgan.token("post", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : " ";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :post")
);

app.use(express.static("build"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateID = () => {
  return Math.floor(Math.random() * 10000);
};

const isUniqueName = (name) => {
  return persons.find((person) => person.name === name) === undefined;
};

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.post("/api/persons", (request, response) => {
  if (!request.body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!request.body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  if (isUniqueName(request.body.name)) {
    const person = {
      id: generateID(),
      name: request.body.name,
      number: request.body.number,
    };
    persons = persons.concat(person);
    response.json(person);
  } else {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
