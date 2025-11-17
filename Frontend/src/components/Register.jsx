import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../environments/environment";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    birthDate: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${baseUrl}/auth/signup`, form);

      // Save JWT token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setMessage("Registration successful!");

      // Redirect to home after 1 second
      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (error) {
      console.log("Register Error:", error);
      setMessage("Registration failed.");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

      {message && (
        <p className="mb-4 text-center text-blue-600 font-semibold">{message}</p>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        
        <input
          type="text"
          name="name"
          placeholder="First Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={form.lastname}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
