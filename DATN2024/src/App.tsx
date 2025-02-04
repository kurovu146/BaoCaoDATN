import './App.css';
import 'leaflet/dist/leaflet.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Map from './pages/Map';
import DefaultLayout from './layouts/DefaulLayout';
import Camera from './pages/Camera';
import LandingLayout from './layouts/LandingLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './components/AuthContext';
import ProfilePage from './pages/ProfilePage';
import VSM from './pages/VSM';
import AdminDashboard from './pages/AdminDashboard';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<DefaultLayout content={<Map/>} />} />
      <Route path="login" element={<LandingLayout content={<LoginPage/>} />} />
      <Route path="signup" element={<LandingLayout content={<SignupPage/>} />} />
      <Route path="camera" element={<DefaultLayout content={<Camera/>} />} />
      <Route path="profile" element={<DefaultLayout content={<ProfilePage />} />} />
      <Route path="vsm" element={<DefaultLayout content={<VSM />} />} />
      <Route path="user" element={<DefaultLayout content={<AdminDashboard />} />} />
    </Route>
  )
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
