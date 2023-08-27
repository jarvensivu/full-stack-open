import { useState, useEffect } from "react";
import { ApolloError, useMutation } from "@apollo/client";
import { LOGIN } from "../queries";

const Login = ({ show, setError, handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      let errorMessage = "Unknown error";
      if (error instanceof ApolloError) {
        errorMessage = error.graphQLErrors[0].message;
      }
      setError(errorMessage);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      handleLogin(token);
      setUsername("");
      setPassword("");
    }
  }, [result.data]); // eslint-disable-line

  if (!show) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
