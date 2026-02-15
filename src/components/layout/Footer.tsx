import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Send, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">VS</div>
              <span className="text-lg font-bold">VBB <span className="text-primary">STORE</span></span>
            </div>
            <p className="text-sm text-primary-foreground/70 mb-4">
              Your trusted source for verified Facebook Business Managers, WhatsApp API accounts, and premium digital advertising products.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/verifiedbmbuy" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="https://www.instagram.com/verifiedbmbuy" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="https://x.com/verifiedbmbuy" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="https://www.youtube.com/@verifiedbmbuy" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"><Youtube className="w-4 h-4" /></a>
              <a href="https://t.me/Verifiedbmbuy" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"><Send className="w-4 h-4" /></a>
              <a href="https://wa.me/8801302669333" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"><MessageCircle className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link to="/blog" className="hover:text-primary-foreground transition-colors">Blog</Link></li>
              <li><Link to="/shop" className="hover:text-primary-foreground transition-colors">Shop</Link></li>
              <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/shop" className="hover:text-primary-foreground transition-colors">Verified Business Managers</Link></li>
              <li><Link to="/shop" className="hover:text-primary-foreground transition-colors">WhatsApp Business API</Link></li>
              <li><Link to="/shop" className="hover:text-primary-foreground transition-colors">Facebook Ads Accounts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>VBB STORE, Madergonj, Pirgonj, Rangpur, Bangladesh - 5470</li>
              <li><a href="https://wa.me/8801302669333" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">+880 1302 669333</a></li>
              <li><a href="mailto:info@verifiedbmbuy.com" className="hover:text-primary-foreground transition-colors">info@verifiedbmbuy.com</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <span>© {new Date().getFullYear()} VBB STORE. All rights reserved.</span>
          <Link to="/admin/login" className="hover:text-primary-foreground transition-colors">Login</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
