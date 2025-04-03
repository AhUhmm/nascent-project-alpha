
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("w-full py-4 border-b", className)}>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold">Project Title</h1>
      </div>
    </header>
  );
};

export default Header;
