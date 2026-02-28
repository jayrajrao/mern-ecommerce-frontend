import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth.service";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.cpassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const data = await registerUser(form);

const token = data?.token || data?.data?.token;

if (token) {
  localStorage.setItem("token", token);
}

      toast.success("Registration successful");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white shadow rounded-xl"
      >
        <h2 className="mb-6 text-2xl font-bold text-center">Register</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          name="cpassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="w-full p-2 mb-6 border rounded"
          required
        />

        <button className="w-full py-2 text-white bg-black rounded hover:bg-gray-800">
          Register
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;