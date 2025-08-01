import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { z } from "zod";
import axios from "../config/axios";

// Zod Schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0],
        password: fieldErrors.password?.[0],
      });
      setLoading(false);
      return;
    }
    console.log("Form data is valid:", formData);
    try {
      const res = await axios.post("http://localhost:3000/user/login", formData);

      if (res.status === 200) {
        setMessage("Login successful!");
        navigate("/app");
      } else {
        setMessage(res.data.error || "Invalid credentials.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to connect to server.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-700 mb-2">CollabWrite</h1>
          <p className="text-sm text-gray-600">Sign in to your account</p>
        </div>

        <div className="border border-gray-400 bg-white rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div
                className={`text-sm text-center p-2 rounded ${
                  message.includes("successful")
                    ? "text-green-600 bg-green-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {message}
              </div>
            )}

            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.username && (
                <p className="text-sm text-red-600 mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <NavLink to="/register" className="text-blue-600 hover:text-blue-700 text-sm">
              New here? Register
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
