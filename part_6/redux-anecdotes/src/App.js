import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";
import Notifications from "./components/Notifications";

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <Notifications />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
