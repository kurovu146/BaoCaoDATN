// ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../styles/Profile.css';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth(); // Lấy thông tin người dùng và hàm cập nhật
  const navigate = useNavigate();

  // Đảm bảo gọi useState ngoài điều kiện
  const [email, setEmail] = useState<string>(user?.email || '');
  const [avatar, setAvatar] = useState<string>(user?.avatar || '');
  const [error, setError] = useState<string>('');

  // Chỉ khi user có, mới thực hiện logic dưới
  useEffect(() => {
    if (!user) {
      navigate('/login'); // Chuyển hướng nếu chưa có user
    } else {
      setEmail(user.email);
      setAvatar(user.avatar);
    }
  }, [user, navigate]); // Thêm user và navigate vào dependency array

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, avatar }),
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data.user); // Cập nhật lại thông tin người dùng trong context
        setError('');
        alert('Profile updated successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    }
  };

  // Đảm bảo render luôn trả về nội dung nếu có user
  if (!user) return null; // Chuyển hướng hoặc trả về null nếu không có user

  return (
    <div className="profile-container">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Avatar URL *</label>
        <input
          type="text"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="Enter avatar URL"
          required
        />

        <button type="submit" className="profile-button primary">
          Save Changes
        </button>

        {error && <p className="error-message">{error}</p>} {/* Hiển thị lỗi nếu có */}
      </form>
    </div>
  );
};

export default ProfilePage;
