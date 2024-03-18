import { useQuery, useMutation, useQueryClient } from "react-query"
import AnecdoteForm from "./components/AnecdoteForm";
import Notifications from "./components/Notifications";
import anecdoteService from "./services/anecdotes";
import { useNotificationHandler } from "./context/NotificationsContext";

const App = () => {
  const queryClient = useQueryClient()
  const notificationHandler = useNotificationHandler()

  const updateAnecdoteMutation = useMutation(anecdoteService.updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData("anecdotes")
      queryClient.setQueryData(
        "anecdotes",
        anecdotes.map((anecdote) =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        )
      )
      const id = Math.floor(Math.random() * 1000000)
      notificationHandler({ content: `you voted '${updatedAnecdote.content}'`, id })
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: "anecdotes",
    queryFn: anecdoteService.getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>loading data...</div>;
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notifications />
      <AnecdoteForm />

      {data.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
