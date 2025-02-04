import { Role } from "../utils/enum";

export interface MenuItem {
  icon: string;
  text: string;
  path: string;
}

export interface HeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export interface SidebarProps {
  isOpen: boolean;
}

export interface CameraCreate {
  streamKey: string,
  userId?: number,
  lat: string,
  lng: string,
  country: string,
  city: string,
  district: string
}

export interface CameraInterface {
  id: number;
  streamKey: string,
  userId: number,
  lat: string,
  lng: string,
  country: string,
  city: string,
  district: string
}

export interface User {
  id: number;
  email: string;
  avatar: string;
  role: Role;
  token: string;
}