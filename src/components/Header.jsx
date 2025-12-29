import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { publicAPI } from "../utils/api";
import Logo from "../assets/logo.png";
import Logo2 from "../assets/logo-2.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [websiteInfo, setWebsiteInfo] = useState({});
  const [profile, setProfile] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Load website info and profile
    Promise.all([publicAPI.getWebsiteInfo(), publicAPI.getProfile()])
      .then(([websiteResponse, profileResponse]) => {
        setWebsiteInfo(websiteResponse.data);
        setProfile(profileResponse.data);
      })
      .catch(console.error);

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Beranda", href: "/", current: location.pathname === "/" },
    {
      name: "Tentang APPGI",
      href: "/tentang",
      current: location.pathname === "/tentang",
    },
    {
      name: "Visi & Misi",
      href: "/visi-misi",
      current: location.pathname === "/visi-misi",
    },
    {
      name: "Struktur Organisasi",
      href: "/struktur",
      current: location.pathname === "/struktur",
    },
    {
      name: "Kontak",
      href: "/kontak",
      current: location.pathname === "/kontak",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg backdrop-blur-sm"
          : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            {/* {profile.logo_url && (
              <img
                src={`https://api-inventory.isavralabel.com${profile.logo_url}`}
                alt="APPGI Logo"
                className="h-10 w-auto lg:h-12 transition-transform duration-300 group-hover:scale-105"
              />
            )} */}
            <div className="hidden md:flex gap-2">
              <img
                src={Logo}
                alt="APPGI Logo"
                className="h-auto w-24 transition-transform duration-300 group-hover:scale-105"
              />
              <img
                src={Logo2}
                alt="APPGI Logo"
                className="h-auto w-24 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  item.current
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden w-full flex justify-between">
            <Link to="/" className="flex gap-2">
              <img
                src={Logo}
                alt="APPGI Logo"
                className="h-auto w-20 transition-transform duration-300 group-hover:scale-105"
              />
               <img
                src={Logo2}
                alt="APPGI Logo"
                className="h-auto w-20 transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <button
              type="button"
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 transition-transform duration-200 ${
                  isMenuOpen ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-64 pb-4" : "max-h-0"
          }`}
        >
          <div className="space-y-1 border-t border-gray-100 pt-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  item.current
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
