// src/pages/UserList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList({ startChat, logout }) {
  const [users, setUsers] = useState([]);
  const currentUserEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        const filtered = res.data.filter((user) => user.email !== currentUserEmail);
        setUsers(filtered);
      } catch (err) {
        console.error("Kullanıcılar alınamadı:", err);
      }
    };

    fetchUsers();
  }, [currentUserEmail]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Üst bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kullanıcı Listesi</h2>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Çıkış Yap
        </button>
      </div>

      {/* Kullanıcı listesi */}
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => startChat(user.email)}
            className="bg-gray-900 hover:bg-purple-600 p-3 rounded cursor-pointer transition-colors"
          >
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
