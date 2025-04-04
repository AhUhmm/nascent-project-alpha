
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStratum } from "@/contexts/StratumContext";
import {
  Grid2X2,
  Layers,
  Menu,
  PlusCircle,
  SearchIcon,
  Columns4,
  RefreshCw,
  Bot,
} from "lucide-react";
import StratumCatalog from "@/components/StratumCatalog";

type TopBarProps = {
  onToggleSidebar: () => void;
  onToggleAIAssistant: () => void;
};

const TopBar = ({ onToggleSidebar, onToggleAIAssistant }: TopBarProps) => {
  const {
    viewMode,
    setViewMode,
    addStratum,
    strata,
    activeStratumId,
    searchLocation,
    locationLocked,
    toggleLocationLock,
  } = useStratum();

  const [showCatalog, setShowCatalog] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const query = formData.get("search") as string;

    if (query && activeStratumId) {
      searchLocation(query, activeStratumId);
      form.reset();
    }
  };

  return (
    <div className="h-14 border-b bg-card flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="font-semibold text-lg flex items-center">
          <Layers className="h-5 w-5 mr-2 text-stratum-blue" />
          <span>Stratoview</span>
        </div>

        <div className="flex items-center space-x-1 ml-4">
          <Button
            variant={viewMode === "single" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("single")}
            className="h-8"
          >
            <Layers className="h-4 w-4 mr-1" />
            Single
          </Button>

          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-8"
          >
            <Grid2X2 className="h-4 w-4 mr-1" />
            Grid
          </Button>

          <Button
            variant={viewMode === "columns" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("columns")}
            className="h-8"
          >
            <Columns4 className="h-4 w-4 mr-1" />
            Columns
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant={locationLocked ? "default" : "outline"}
          size="sm"
          onClick={toggleLocationLock}
          className="h-8"
          title={
            locationLocked ? "Unsynchronize locations" : "Synchronize locations"
          }
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          {locationLocked ? "Synced Locations" : "Unsynced Locations"}
        </Button>

        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            name="search"
            placeholder="Search location..."
            className="w-64 h-8 pl-8"
          />
          <SearchIcon className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
        </form>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCatalog(true)}
          disabled={strata.length >= 4}
          className="h-8"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Stratum
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleAIAssistant}
          className="text-muted-foreground hover:text-foreground h-8 w-8"
        >
          <Bot className="h-5 w-5" />
        </Button>
      </div>

      <StratumCatalog
        isOpen={showCatalog}
        onClose={() => setShowCatalog(false)}
      />
    </div>
  );
};

export default TopBar;
