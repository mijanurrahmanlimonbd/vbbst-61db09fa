import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex items-center justify-center py-24 md:py-32">
        <div className="text-center max-w-md px-4">
          <div className="text-8xl font-bold text-primary mb-4">404</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
