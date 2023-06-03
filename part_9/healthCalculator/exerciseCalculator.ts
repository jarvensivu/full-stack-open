import { isNotNumber } from "./utils";

const enum Rating {
  Bad = 1,
  NotTooBad = 2,
  Good = 3,
}

const enum RatingDescription {
  Bad = "You can do better!",
  NotTooBad = "Not too bad but could be better!",
  Good = "Good job!",
}

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  dailyExerciseHours: number[];
  targetAmount: number;
}

const parseArguments = (args: string[]): ExerciseValues => {
  const rawData = args.splice(2);

  const processedData: number[] = [];

  for (const data of rawData) {
    if (isNotNumber(data)) throw new Error("Provided values were not numbers!");
    processedData.push(Number(data));
  }

  return {
    dailyExerciseHours: processedData.slice(0, -1),
    targetAmount: processedData[processedData.length - 1],
  };
}

const calculateRating = (average: number, target: number): Rating => {
  if (average < (target / 2)) return Rating.Bad;
  if (average < target) return Rating.NotTooBad;
  return Rating.Good;
};

const getDesciption = (rating: Rating): string => {
  switch (rating) {
    case Rating.Bad:
      return RatingDescription.Bad;
    case Rating.NotTooBad:
      return RatingDescription.NotTooBad;
    case Rating.Good:
      return RatingDescription.Good;
    default:
      throw new Error("Invalid rating!");
  }
};

const calculateExercises = (dailyExerciseHours: number[], target: number ): Result => {
  const periodLength = dailyExerciseHours.length;
  const trainingDays = dailyExerciseHours.filter(hours => hours > 0).length;
  const average = dailyExerciseHours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;
  const rating = calculateRating(average, target);
  const ratingDescription = getDesciption(rating);

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  }
};


try {
  const { dailyExerciseHours, targetAmount } = parseArguments(process.argv);
  console.log(calculateExercises(dailyExerciseHours, targetAmount));
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log("Error:", error.message);
  }
}