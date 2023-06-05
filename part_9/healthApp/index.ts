import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
import { isNotNumber } from './utils';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const {weight, height} = req.query;

  if (!weight || !height || isNotNumber(weight) || isNotNumber(height)) {
    res.status(400).json({error: 'malformatted parameters'});
  }
  else {
    const bmi = calculateBmi(Number(height), Number(weight));
    res.json({weight, height, bmi});
  }
});

app.post('/exercises', (req, res) => {
    const { daily_exercises, target } = req.body as { daily_exercises: number[], target: number }; 

    if (!daily_exercises || !target) {
      return res.status(400).json({error: 'parameters missing'});
    }
    if (!Array.isArray(daily_exercises) || daily_exercises.some(exercise => isNotNumber(exercise)) || isNotNumber(target)) {
      return res.status(400).json({error: 'malformatted parameters'});
    }
    const result = calculateExercises(daily_exercises, target);
    return res.json(result);
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});