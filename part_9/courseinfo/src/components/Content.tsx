import { ContentProps } from "../types";

const Content = ( props: ContentProps ) => {
  const { courseParts } = props;
  return (
    <div>
    {courseParts.map((part) => (<p key={part.name}>
        {part.name} {part.exerciseCount}
    </p>))}
    </div>);
}

export default Content;
