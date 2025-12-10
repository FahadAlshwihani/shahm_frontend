import React from "react";
import AppRouter from "./router/AppRouter";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
          {/* <Navbar /> */}
      <AppRouter />
      <Footer />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
