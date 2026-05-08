import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      navigate("/dashboard");

      console.log(response.data);

      localStorage.setItem("token", response.data.token);

    } catch (error) {

      console.log(error);

      alert("Login Failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "10px",
          margin: "10px",
          width: "250px",
        }}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "10px",
          margin: "10px",
          width: "250px",
        }}
      />

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          marginTop: "10px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;