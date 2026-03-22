import {
  useState,
  useContext
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  loginUser
} from "../services/authService";

import AuthContext
from "../context/AuthContext";

function Login() {

  const [username,
    setUsername] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [error,
    setError] =
    useState("");

  const navigate =
    useNavigate();

  const { login } =
    useContext(
      AuthContext
    );

  const handleSubmit =
    async (e) => {

    e.preventDefault();

    try {

      const data =
        await loginUser(
          username,
          password
        );

      login(data);

      navigate("/");

    } catch (err) {

      setError(
        "Invalid credentials"
      );

    }

  };

  return (

    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">

          FraudShield Login

        </h2>

        {error && (

          <div className="text-red-500 mb-4">

            {error}

          </div>

        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-4 rounded"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-6 rounded"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >

          Login

        </button>

      </form>

    </div>

  );

}

export default Login;