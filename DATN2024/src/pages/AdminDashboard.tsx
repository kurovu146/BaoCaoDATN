import React, { useEffect, useState } from 'react';
import '../styles/AdminDashboard.css'; // Thêm CSS nếu cần
import { CallAPI } from '../utils/common';

interface UserWithCameras {
  id: number;
  name: string;
  email: string;
  cameraCount: number;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserWithCameras[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchUsersWithCameras = async () => {
      try {
        const response = await CallAPI('GET', 'admin/users-with-cameras');

        if (response.statusText !== 'OK') {
          throw new Error(`Error: ${response.status}`);
        }

        const data: UserWithCameras[] = response.data;
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithCameras();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Number of Cameras</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.cameraCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
