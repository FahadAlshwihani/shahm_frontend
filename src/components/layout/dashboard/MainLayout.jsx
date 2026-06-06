import Navbar from "../public/Navbar";
import Footer from "../public/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      <main className="page-content">
        {children}
      </main>

      <Footer />

    </>
  );
}
