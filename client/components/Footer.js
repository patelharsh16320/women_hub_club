export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">© {new Date().getFullYear()} Women Hub. All rights reserved.</p>
        <p className="text-xs opacity-80 mt-2">Built with ❤️ for women entrepreneurs.</p>
      </div>
    </footer>
  );
}
