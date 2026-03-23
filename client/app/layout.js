import Header from './components/Header';
import Footer from '../components/Footer';
import BootstrapClient from './components/BootstrapClient';
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppGuard from "./components/AppGuard";

export const metadata = {
  title: 'Women Hub',
  description: 'Women Hub shop'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col text-dark">
        <Header />
        <BootstrapClient />
        <AppGuard>
          <main className="flex-1">{children}</main>
        </AppGuard>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      </body>
    </html>
  );
}