import { useState, useEffect } from "react";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommend from "./components/Recommend";
import Login from "./components/Login";
import Notify from "./components/Notify";
import { BOOK_ADDED, ME } from "./queries";
import { ERRORCOLOR, INFOCOLOR } from "./const";
import { updateAuthors, updateBooks } from "./cache";

const App = () => {
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");
  const client = useApolloClient();

  const userResult = useQuery(ME);
  const favoriteGenre = userResult?.data?.me?.favoriteGenre;

  useEffect(() => {
    const localUserToken = localStorage.getItem("app-user-token");
    if (localUserToken) {
      setToken(localUserToken);
    }
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      if (!data?.data?.bookAdded) {
        return;
      }
      handleNewBook(data.data.bookAdded, client);
    }
  })

  const handleNewBook = (book, client) => {
    const author = book.author.name;
    const title = book.title;
    updateBooks(client, book);
    updateAuthors(client, book);
    setInfoMessage(`New book added: ${title} by ${author}`);
    setTimeout(() => {
      setInfoMessage(null);
    }, 10000);
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem("app-user-token", token);
    setPage("authors");
  }

  const handleLogout = () => {
    setToken("");
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <div>
      <Notify message={errorMessage} color={ERRORCOLOR} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>
      <Authors
        show={page === "authors"}
        setError={notify}
      />
      <Books
        show={page === "books"}
        selectedGenre={selectedGenre}
        handleGenreChange={handleGenreChange}
      />
      <Recommend
        show={page === "recommend"}
        favoriteGenre={favoriteGenre}
      />
      <NewBook
        show={page === "add"}
        setError={notify}
      />
      <Login
        show={page === "login"}
        setError={notify}
        handleLogin={handleLogin}
      />
      <Notify message={infoMessage} color={INFOCOLOR} />
    </div>
  );
};

export default App;
