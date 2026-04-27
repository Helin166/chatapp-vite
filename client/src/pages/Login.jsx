import { useState } from "react";
import axios from "axios";

function Login({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Lütfen e-posta ve şifre girin");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      onLogin(response.data.email);
    } catch (err) {
      setError(err.response?.data?.message || "Giriş başarısız");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="bg-zinc-900 p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Giriş Yap</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-md w-full mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-md w-full mb-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 transition w-full py-3 rounded-md font-semibold"
        >
          Giriş Yap
        </button>

        <p className="text-sm text-center mt-6">
          Hesabınız yok mu?{" "}
          <button onClick={onGoToRegister} className="text-blue-400 hover:underline">
            Kayıt olun
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
