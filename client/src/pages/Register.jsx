import { useState } from "react";
import axios from "axios";

function Register({ onRegisterSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Lütfen e-posta ve şifre girin.");
      setMessage("");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });

      setError("");
      setMessage("✅ Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.message || "❌ Kayıt başarısız. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="bg-zinc-900 p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Kayıt Ol</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition w-full py-3 rounded-md font-semibold"
          >
            Kayıt Ol
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm text-center">{message}</p>}

          <p className="text-sm text-center mt-2">
            Zaten hesabınız var mı?{" "}
            <button
              type="button"
              onClick={onRegisterSuccess}
              className="text-blue-400 hover:underline"
            >
              Giriş yap
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
