import { TotalProps } from "../types";

const Total = (props: TotalProps) => {
  const { courseParts } = props;
  return (
    <p>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};

export default Total;
