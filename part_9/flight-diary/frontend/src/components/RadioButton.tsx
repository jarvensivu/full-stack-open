import { RadioButtonProps } from "../types";

const RadioButton = (props: RadioButtonProps) => {
  const { button, currentValue, handleSelect } = props;
  return (
    <label>
      {button}
      <input
        type="radio"
        id={button}
        name={button}
        value={button}
        checked={button === currentValue}
        onChange={handleSelect}
      />
    </label>
  );
}

export default RadioButton;
