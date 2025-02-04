import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "../components/LocationMarker";
import { useEffect, useState } from "react";
import { CallAPI } from "../utils/common";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";


const Map: React.FC = () => {
  const [cameraList, setCameraList] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function getCameraList() {
      try {
        const response = await CallAPI('GET', '/cameras');
        if (response.status === 200) {
          const data = response.data;
          setCameraList(data);
        }
      } catch (error) {
        logout();
        navigate('/login');
      }
    }

    getCameraList();
  }, []);

  return (
    <MapContainer
      center={[21.028511, 105.804817]}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {cameraList.map((item, index) => (
        <LocationMarker item={item} key={"c" + index} />
      ))}
    </MapContainer>
  );
};

export default Map;