import axios from "axios";
import { useState } from "react";

export default function SignUp() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  function handleSubmit() {
    const authenticate = axios.post(
      "http://192.168.68.74:3000/signup",
      {
        username: username,
        password: password,
      },
      { "content-type": "application/x-www-form-urlencoded" }
    );
    console.log(authenticate);
  }

  return (
    <>
      <h1>Sign up</h1>
      <section>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
      </section>
      <section>
        <label htmlFor="new-password">Password</label>
        <input
          id="new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </section>
      <button type="button" onClick={handleSubmit}>
        Sign up
      </button>
    </>
  );
}
