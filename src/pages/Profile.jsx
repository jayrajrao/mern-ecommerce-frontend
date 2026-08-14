import { useEffect, useState } from "react";
import { api } from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        setUser(res.data?.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="max-w-3xl p-6 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">My Profile</h1>

      <div className="p-4 bg-white rounded-lg shadow">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>
      </div>
    </div>
  );
}

export default Profile;