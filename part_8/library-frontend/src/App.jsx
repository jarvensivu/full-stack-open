import { useState, useEffect } from "react";
import { useApolloClient, useQuery } from '@apollo/client'
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommend from "./components/Recommend";
import Login from "./components/Login";
import Notify from "./components/Notify";
import { ME } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null);
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
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <div>
      <Notify errorMessage={errorMessage} />
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
        favoriteGenre={favoriteGenre}
      />
      <Login
        show={page === "login"}
        setError={notify}
        handleLogin={handleLogin}
      />
    </div>
  );
};

export default App;
