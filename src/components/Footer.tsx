
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  const location = useLocation();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/', hash: '#features' },
      { name: 'Meal Plans', href: '/meal-plans', hash: null },
      { name: 'Analytics', href: '/analytics', hash: null },
      { name: 'Mobile App', href: '#', hash: null },
    ],
    company: [
      { name: 'About Us', href: '/about', hash: null },
      { name: 'Careers', href: '#', hash: null },
      { name: 'Press', href: '#', hash: null },
      { name: 'Blog', href: '#', hash: null },
    ],
    support: [
      { name: 'Help Center', href: '#', hash: null },
      { name: 'Contact Us', href: '/contact', hash: null },
      { name: 'Privacy Policy', href: '#', hash: null },
      { name: 'Terms of Service', href: '#', hash: null },
    ],
  };

  const handleLinkClick = (href: string, hash: string | null) => {
    if (hash && location.pathname === '/') {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const renderLink = (link: { name: string; href: string; hash: string | null }) => {
    if (link.href === '#') {
      return (
        <button
          key={link.name}
          onClick={() => handleLinkClick(link.href, link.hash)}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          {link.name}
        </button>
      );
    }

    if (link.hash) {
      return (
        <Link
          key={link.name}
          to={`${link.href}${link.hash}`}
          onClick={() => handleLinkClick(link.href, link.hash)}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          {link.name}
        </Link>
      );
    }

    return (
      <Link
        key={link.name}
        to={link.href}
        className="text-gray-400 hover:text-white transition-colors duration-200"
      >
        {link.name}
      </Link>
    );
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-health-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-poppins font-bold text-xl">NutriGuide AI</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Empowering healthier lives through personalized nutrition guidance powered by artificial intelligence.
            </p>
            <div className="space-y-2">
              <Button className="w-full btn-primary">
                Download iOS App
              </Button>
              <Button variant="outline" className="w-full text-white border-gray-600 hover:bg-gray-800">
                Download Android App
              </Button>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © 2024 NutriGuide AI. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <button className="hover:text-white transition-colors duration-200">Privacy</button>
            <button className="hover:text-white transition-colors duration-200">Terms</button>
            <button className="hover:text-white transition-colors duration-200">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
