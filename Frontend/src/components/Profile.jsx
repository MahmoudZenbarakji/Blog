import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../environments/environment";

const Profile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.data);
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, []);

  if (!user) {
    return (
      <p className="text-center text-gray-600 mt-10 text-lg">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-3xl font-bold text-center mb-6">Your Profile</h2>

      <div className="flex flex-col items-center mb-6">
        <div className="w-28 h-28 bg-gray-300 rounded-full flex items-center justify-center text-3xl font-bold text-white">
          {user.name[0]}
        </div>
        <h3 className="mt-4 text-xl font-semibold">
          {user.name} {user.lastname}
        </h3>
      </div>

      <div className="space-y-3 text-gray-700">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Birth Date:</strong> {user.birthDate}</p>
      </div>
    </div>
  );
};

export default Profile;
