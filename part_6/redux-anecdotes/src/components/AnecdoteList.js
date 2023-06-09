import { useSelector, useDispatch } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";
import { setNotification, removeNotification } from "../reducers/notificationsReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) =>
    state.filter === ""
      ? state.anecdotes
      : state.anecdotes.filter((anecdote) =>
          anecdote.content.toLowerCase().includes(state.filter)
        )
  );

  const dispatch = useDispatch();

  const vote = (id, content) => {
    dispatch(addVote(id));
    dispatch(setNotification(`you voted anecdote: '${content}'`));
    setTimeout(() => {
      dispatch(removeNotification())
      }, 5000
    )
  };

  return (
    <div>
      {anecdotes
        .slice()
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
