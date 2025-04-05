import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Google OAuth client ID from Google Developer Console
const GOOGLE_CLIENT_ID = "173344335345-gn2ks0pn0gdtktkttjau85ai3lvch600.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
