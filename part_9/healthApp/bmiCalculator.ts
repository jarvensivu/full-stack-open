import { isNotNumber } from "./utils";

const enum BmiCategory {
  UnderweightSevereThinness = 'Underweight (severe thinness)',
  UnderweightModerateThinness = 'Underweight (moderate thinness)',
  UnderweightMildThinness = 'Underweight (mild thinness)',
  NormalHealthyWeight = 'Normal (healthy weight)',
  Overweight = 'Overweight',
  ObeseClassI = 'Obese Class I (Moderate)',
  ObeseClassII = 'Obese Class II (Severe)',
  ObeseClassIII = 'Obese Class III (Very severe)',
}

interface BmiValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (isNotNumber(args[2]) || isNotNumber(args[3]))
    throw new Error("Provided values were not numbers!");

  return {
    height: Number(args[2]),
    weight: Number(args[3]),
  };
};

const calculateBmi = (height: number, weight: number): BmiCategory => {
  const bmi = weight / Math.pow(height / 100, 2);

  if (bmi < 16) return BmiCategory.UnderweightSevereThinness;
  if (bmi < 17) return BmiCategory.UnderweightModerateThinness;
  if (bmi < 18.5) return BmiCategory.UnderweightMildThinness;
  if (bmi < 25) return BmiCategory.NormalHealthyWeight;
  if (bmi < 30) return BmiCategory.Overweight;
  if (bmi < 35) return BmiCategory.ObeseClassI;
  if (bmi < 40) return BmiCategory.ObeseClassII;
  return BmiCategory.ObeseClassIII;
};

if (require.main === module) {
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error:", error.message);
    }
  }
}

export default calculateBmi;