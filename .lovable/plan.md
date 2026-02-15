
# VBB Store — Exact Copy with Supabase Backend

## Overview
Build a pixel-perfect replica of vbbs.lovable.app — a professional e-commerce site selling verified Facebook Business Managers, WhatsApp API accounts, and related digital advertising products. The site will use Supabase (Lovable Cloud) for dynamic content management.

---

## Pages & Layout

### Global Components
- **Navbar**: Logo (VBB STORE), navigation links (Home, Shop, Blog, Contact Us, About Us), cart icon, user/account icon. Sticky top bar, white background.
- **Footer**: Company info, quick links, product categories, social media icons (Facebook, Instagram, X, YouTube, Telegram, WhatsApp), contact details, copyright.
- **Floating WhatsApp button**: Bottom-right corner on all pages.

### 1. Home Page (/)
- **Hero Section**: VBB Store logo/badge image on the left, "Best Verified Business Manager 2026" badge, heading, description text, 4 CTA buttons (WhatsApp, Telegram, Facebook, Email)
- **Stats Bar**: 4 stats — 100% Verified, A+ Rated, 5+ Years, Instant Delivery
- **Features Section**: 3 cards — 24/7 Support, Instant Delivery, 7 Days Replacement
- **Products Section**: "Our Products" heading with category filter tabs (All, Verified BM, WhatsApp API, Facebook Accounts, TikTok Ads, Google Ads, Reinstated Profiles, Snapchat Ads). Product cards with image, badge (Sale/Best Seller/New/Premium), title, description, rating, pricing (with sale prices), safety/delivery/support icons, and 3 buy buttons (WhatsApp, Telegram, Buy Now)
- **Why Verified BM Section**: 12 benefit cards in a grid (Higher Trust Score, Better Ad Results, etc.)
- **WhatsApp API Section**: 12 benefit cards for WhatsApp API features
- **Our Services Section**: 8 service cards (Verified BMs, WhatsApp API, Facebook Ads, Reinstated Profiles, TikTok & Google Ads, Bulk Orders, Custom Setups, Dedicated Account Manager)
- **Why VBB Store Section**: 6 trust/credibility cards
- **Scale Up CTA Section**: Large text block with "Browse Products" button and 4 stat cards (10x Scaling, Lower CPMs, Multi-Client, No Spend Cap)
- **Top Advertisers Section**: 6 metric cards with progress bars (99.9% Trust, 10x Scale, 50+ Tools, 3x Delivery, 100% Protected, A+ Professional)
- **Key Advantages Section**: 6 feature cards
- **Portfolio Section**: 6 work sample cards with project descriptions
- **Testimonials Section**: Carousel of customer reviews with avatars, names, roles
- **FAQ Section**: 20 expandable accordion items
- **About Section**: Company description with stats (100% Verified, 50+ Countries, 5+ Years, 10K+ Customers)
- **Contact/Map Section**: Store address, working hours, embedded map, contact channels

### 2. Shop Page (/shop)
- Blue gradient hero header with breadcrumbs, title, description, search bar
- Category filter tabs (All, Verified BM, WhatsApp API, Facebook Accounts, TikTok Ads, Reinstated Profiles)
- Product grid with the same card design as the home page
- Products loaded dynamically from Supabase

### 3. Blog Page (/blog)
- Blue gradient hero header with breadcrumbs, title, description
- Category filter tabs (All, Verified BM, WhatsApp API, Tips & Guides, Guides)
- Blog post cards with featured image, read time, date, title, category badge, excerpt, "Read More" link
- Individual blog post pages (/blog/:slug) with full article content

### 4. Contact Us Page (/contact)
- Blue gradient hero header with CTA buttons (WhatsApp, Telegram) and social media icons
- Stats bar (5,000+ Customers, <2 min Response, 50+ Countries, 4.9/5 Rating)
- Contact channels section: 4 channel cards (WhatsApp, Telegram, Email, Messenger)
- Store address and support hours info
- Contact form (Name, Email, Subject, Message, Send button)
- "Why Customers Trust VBB STORE" section

### 5. About Us Page (/about)
- Blue gradient hero header with social media icons
- Stats bar (5+ Years, 10K+ Customers, 50+ Countries, 4.9/5 Satisfaction)
- Company description and "What Sets VBB STORE Apart" feature cards
- Team/company information section

### 6. Product Detail Page (/product/:slug)
- Product image gallery, pricing, description, buy buttons, related products

---

## Database (Supabase / Lovable Cloud)

### Tables
- **products**: id, title, slug, description, short_description, price, sale_price, category, badge (sale/best-seller/new/premium), image_url, rating, is_featured, sort_order, created_at
- **blog_posts**: id, title, slug, content (markdown/rich text), excerpt, featured_image, category, read_time, published_at, created_at
- **contact_messages**: id, name, email, subject, message, created_at (for the contact form)

---

## Design & Styling
- **Color scheme**: Primary blue (#2563EB), white backgrounds, dark text, orange/green/red accents for badges
- **Typography**: Clean, professional sans-serif font
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Blue gradient headers** on inner pages (Shop, Blog, Contact, About)
- **Responsive design**: Mobile-friendly with hamburger menu
- **Animations**: Smooth scroll, hover transitions on cards and buttons

---

## Key Interactions
- Product category filtering (tab-based)
- Blog category filtering
- Search products on the Shop page
- FAQ accordion expand/collapse
- Contact form submission (saves to Supabase)
- External links open in new tabs (WhatsApp, Telegram, Facebook, Email)
- Floating WhatsApp chat button
