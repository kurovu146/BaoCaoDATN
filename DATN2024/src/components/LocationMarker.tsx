import { Marker } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import { useState } from 'react';
import LiveStreamPlayer from "./LiveStreamPlayer";

const customIcon = new L.Icon({
  iconUrl: '/camera.png', 
  iconSize: [16, 16], 
});

function LocationMarker({ item }: any) {
  const [showVideo, setShowVideo] = useState(false);

  const handleMarkerClick = () => {
    setShowVideo(true); // Set state để hiện video
  };

  return (
    <>
      <Marker position={[item.lat, item.lng]} icon={customIcon} eventHandlers={{ click: handleMarkerClick }}>
        {showVideo && (
          <div style={{ position: 'absolute', display: 'flex', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 999 }}>
            <div style={{margin: 'auto'}}>
              <LiveStreamPlayer onClose={() => setShowVideo(false)} streamUrl={`http://localhost:8000/live/${item.streamKey}.flv`} streamKey={item.streamKey} canClose={true}/>
            </div>
          </div>
        )}
      </Marker>
    </>
  );
}

export default LocationMarker;
