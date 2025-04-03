
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("w-full py-4 border-t mt-auto", className)}>
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Project Title. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
