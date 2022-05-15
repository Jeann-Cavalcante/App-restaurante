import { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "../contexts/AuthContext";

import "../../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ToastContainer autoClose={3000} />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
