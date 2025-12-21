import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      <main className="page-content">
        {children}
      </main>
    </>
  );
}
