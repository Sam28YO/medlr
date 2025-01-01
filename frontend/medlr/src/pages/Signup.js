import React, { useState } from "react";
import API from "../api";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/signup", formData);
      setMessage("Signup successful! Please login.");
    } catch (error) {
      setMessage("Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full">
          Sign Up
        </button>
        {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
