import React from "react";
import { useState } from "react";
import InputField from "./inputField";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [count, setCount] = useState(0);
  // Presentational - Input

  // Presentational - Button
  const Button = ({ text, onClick }) => (
    <button onClick={onClick}>{text}</button>
  );

  // Container - Form

  const handleSubmit = () => {
    // validate + call API
    console.log("Email:", email, "Password:", password);
  };
  return (
    <div>
      <h2>Create Account</h2>
      <InputField
        label="Your Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Create a password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button text="Create" onClick={handleSubmit} />
      <p>{count}</p>
      <Button text="increase" onClick={() => setCount(count + 1)} />
      <Button text="decrease" onClick={() => setCount(count - 1)} />
    </div>
  );
}

export default Login;
