import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../components/AuthContext";

function DefaultLayout({ content }: any) {
  const {user} = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={styles.container}>
      <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div style={styles.contentWrapper}>
        <Sidebar isOpen={isOpen}/>
        <div style={styles.mapContainer}>
         {user ? content : <p>Login first to use this feature!</p>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    height: '100vh', 
  },
  contentWrapper: {
    display: 'flex' as const,
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    overflow: 'auto' as const,
  },
};


export default DefaultLayout;
