import React, { useState, useEffect } from 'react';
import '../styles/Camera.css'; // Đảm bảo thêm CSS tương ứng
import { generateStreamKey } from '../utils/common';
import { CameraCreate } from '../interfaces/Interface';
import { useAuth } from '../components/AuthContext';
import Popup from '../components/Popup';

const Camera = () => {
  const token = localStorage.getItem('token');
  const { user } = useAuth();
  const [streamKey, setStreamKey] = useState('');
  const [address, userAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [location, setLocation] = useState({
    streamKey:  'defaultStreamKey',
    city: 'HaNoi',
    district: 'HaiBaTrung',
    country: 'Vietnam',
    lat: '0.000000000000',
    lng: '0.000000000000',
  });

  async function getLocationInfo(latitude: any, longitude: any) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${process.env.REACT_APP_GEOCODING_API}`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status.code === 200) {
          console.log("results:", data.results[0].formatted);
          userAddress(data.results[0].formatted);
        } else {
          console.log("Reverse geolocation request failed.");
        }
      })
      .catch((error) => console.error(error));
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await getLocationInfo(latitude, longitude - 0.063);
          const str = address.split(', ');
          setLocation({streamKey, country: str[3], city: str[2], district: str[1], lng: longitude.toString(), lat: latitude.toString() })
        },

        (error) => {
          console.error("Error get user location: ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
    } 
  };

  const createCamera = async (data: CameraCreate): Promise<void> => {
    setIsSaving(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/cameras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      const newStreamKey = generateStreamKey() || 'defaultStreamKey';
      setStreamKey(newStreamKey);
      setShowPopup(true);

      console.log('Camera created successfully:', responseData);
    } catch (error: any) {
      console.error('Error creating camera:', error?.message);
      setError('Failed to create camera. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/cameras?userId=${user?.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("data: ", data);
        
        setStreamKey(data[0]?.streamKey || generateStreamKey());
        if (data[0]) {
          setLocation(data[0]);
        }
      })
      .catch(error => console.error('Error fetching camera data:', error));
  }, []);

  return (
    <div className="camera-page">
      <h1>Set Up Your Webcam</h1>

      <section className="webcam-setup">
        <h2>Change Broadcasting Type</h2>
        <label style={{display: 'flex', alignItems: 'center'}}>
          Open Broadcaster Software - OBS
          <div style={{width: 160, paddingBottom: 5}}>
            <input type="radio" name="broadcastType" value="OBS" defaultChecked />
          </div>
        </label>

        <div className="stream-info">
          <label>
            Stream Key
            <input type="text" value={streamKey} readOnly />
          </label>
          <label>
            Server URL
            <input type="text" value={process.env.REACT_APP_STREAM_URL} readOnly />
          </label>
        </div>
      </section>

      <section className="location-weather">
        <h2>Location & Weather</h2>
        <button style={{width: 150}} onClick={getUserLocation}>Get Current Location</button>
        <div className="location-inputs">
          <label>
            District
            <input
              type="text"
              value={location.district}
              onChange={(e) =>
                setLocation({ ...location, district: e.target.value })
              }
            />
          </label>
          <label>
            City
            <input
              type="text"
              value={location.city}
              onChange={(e) =>
                setLocation({ ...location, city: e.target.value })
              }
            />
          </label>
          <label>
            Country
            <input
              type="text"
              value={location.country}
              onChange={(e) =>
                setLocation({ ...location, country: e.target.value })
              }
            />
          </label>
        </div>
        <div className="weather-inputs">
          <label>
            Latitude
            <input
              type="text"
              value={location.lat}
              onChange={(e) =>
                setLocation({ ...location, lat: e.target.value })
              }
            />
          </label>
          <label>
            Longitude
            <input
              type="text"
              value={location.lng}
              onChange={(e) =>
                setLocation({ ...location, lng: e.target.value })
              }
            />
          </label>
        </div>
      </section>

      <button
        onClick={() => createCamera({ ...location, userId: user?.id })}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save my setting'}
      </button>

      {error && <p className="error-message">{error}</p>}
      {showPopup && (
        <Popup
          message="Camera created successfully!"
          onClose={() => setShowPopup(false)}
        />
      )}

    </div>
  );
};

export default Camera;
