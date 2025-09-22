import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos");
      return;
    }

    const success = await authService.login(username.trim(), password.trim());
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <h1 className="text-xl font-bold mb-4">Iniciar sesión</h1>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => {
            console.log("Username changed:", e.target.value);
            setUsername(e.target.value);
          }}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => {
            console.log("Password changed:", e.target.value);
            setPassword(e.target.value);
          }}
          className="w-full mb-3 p-2 border rounded"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

