import { useEffect, useRef, useState } from 'react';
import FlvJs from 'flv.js';
import { CallAPI } from '../utils/common';
import { useAuth } from './AuthContext';

interface VideoLiveStreamProps {
  onClose: () => void;
  streamUrl: string;
  streamKey: string;
  canClose: boolean;
}

const LiveStreamPlayer = ({ onClose, streamUrl, streamKey, canClose }: VideoLiveStreamProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { user } = useAuth();

  const handleRecord = async () => {
    try {
      const endpoint = isRecording ? "/rtmp/stop" : "/rtmp/start";
      const response = await CallAPI("POST", endpoint, {
        body: {
          streamKey,
          userId: user?.id
        }
      });
      if (response.status === 201) {
        setIsRecording(!isRecording);
        alert(`Recording ${isRecording ? "stopped" : "started"} successfully!`);
      }
    } catch (error) {
      console.error("Error while recording:", error);
      alert("Failed to update recording state.");
    }
  };

  useEffect(() => {
    if (FlvJs.isSupported() && videoRef.current) {
      const flvPlayer = FlvJs.createPlayer({
        type: 'flv',
        url: streamUrl
      });
      flvPlayer.attachMediaElement(videoRef.current);
      flvPlayer.load();
      flvPlayer.muted = true;
      const playPromise = flvPlayer.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => { })
          .catch(error => { });
      }
    } else if (videoRef.current && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = streamUrl;
    }
  }, [streamUrl]);

  return (
    <div style={{ width: '100%', height: '100%', margin: 'auto' }}>
      <button onClick={handleRecord} style={{ marginTop: 10 }}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
      { canClose ? <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>Close</button> : null }
      <video
        ref={videoRef}
        controls
        autoPlay
        loop
        style={{ width: '100%', maxWidth: '1000px', height: '100%', margin: 'auto', display: 'block' }}
      >
        Your browser does not support the video tag.
      </video>
      <video src=""></video>
    </div>
  );
};

export default LiveStreamPlayer;
