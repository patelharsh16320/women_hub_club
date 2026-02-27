// import '../globals.css';
import Header from './components/Header';
import Footer from '../components/Footer';
import BootstrapClient from './components/BootstrapClient';
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

export const metadata = {
	title: 'Women Hub',
	description: 'Women Hub shop'
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-screen flex flex-col">
				<Header />
				<BootstrapClient />
				<main className="flex-1">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
