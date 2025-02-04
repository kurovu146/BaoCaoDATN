import axios from "axios";

const text = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;

export function generateStreamKey(): string {
  let randomText = '';
  for (let i = 0; i < 16; i++) {
    randomText += text[Math.floor(Math.random() * text.length)];
  }
  return randomText;
}

export async function CallAPI(method: string, url: string, data?: any) {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  return axios({
    method,
    url: process.env.REACT_APP_API_URL + url,
    data,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`
    }
  });
}