import React, { useState, useEffect } from "react";
import axios from "axios";

function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError("");
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Lütfen e-posta ve şifre girin.");
      return;
    }

    if (!isLogin && password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });
        setMessage("Giriş başarılı! Sohbete yönlendiriliyorsunuz...");
        onAuthSuccess(res.data.email);
      } else {
        await axios.post("http://localhost:5000/api/auth/register", {
          email,
          password,
        });
        setMessage("Kayıt başarılı! Giriş yapılıyor...");
        const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });
        onAuthSuccess(loginRes.data.email);
      }
    } catch (err) {
      setError(err.response?.data?.message || "İşlem başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 via-purple-900 to-black px-4 text-white">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-purple-700">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? "Giriş Yap" : "Kayıt Ol"}
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 border border-purple-700 px-4 py-3 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 border border-purple-700 px-4 py-3 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
            disabled={loading}
          />

          <button
            type="submit"
            className={`bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition py-3 rounded-md font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
          <button
            onClick={() => {
              setError("");
              setMessage("");
              setIsLogin(!isLogin);
            }}
            className="text-purple-400 hover:underline"
            disabled={loading}
          >
            {isLogin ? "Kayıt olun" : "Giriş yapın"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
