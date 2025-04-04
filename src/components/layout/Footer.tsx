
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">CultureDrop</h3>
            <p className="text-sm text-muted-foreground">
              Merging music, fashion, and cultural identity into a unique shopping experience.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/shop/music" className="text-muted-foreground hover:text-foreground transition-colors">Music</Link></li>
              <li><Link to="/shop/fashion" className="text-muted-foreground hover:text-foreground transition-colors">Fashion</Link></li>
              <li><Link to="/shop/accessories" className="text-muted-foreground hover:text-foreground transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Cultures</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cultures/tokyo" className="text-muted-foreground hover:text-foreground transition-colors">Tokyo</Link></li>
              <li><Link to="/cultures/newyork" className="text-muted-foreground hover:text-foreground transition-colors">New York</Link></li>
              <li><Link to="/cultures/lagos" className="text-muted-foreground hover:text-foreground transition-colors">Lagos</Link></li>
              <li><Link to="/cultures/seoul" className="text-muted-foreground hover:text-foreground transition-colors">Seoul</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <Youtube className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 CultureDrop. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
