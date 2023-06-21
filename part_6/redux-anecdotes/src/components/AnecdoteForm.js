import { useDispatch } from "react-redux";
import anecdoteService from "../services/anecdotes";
import { addAnecdote } from "../reducers/anecdoteReducer";
import { setNotification, removeNotification } from "../reducers/notificationsReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const createAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    const anecdote = await anecdoteService.createNew({ content, votes: 0 });
    dispatch(addAnecdote(anecdote));
    dispatch(setNotification(`you added anecdote: '${anecdote.content}'`));
    setTimeout(() => {
      dispatch(removeNotification())
      }, 5000
    )
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
