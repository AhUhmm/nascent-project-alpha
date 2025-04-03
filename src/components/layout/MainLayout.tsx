
import { cn } from "@/lib/utils";
import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={cn("flex-1 container mx-auto px-4 py-8", className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
