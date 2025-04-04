
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { useStratum } from "@/contexts/StratumContext";
import { Plus, X, Globe, Grid2X2, Columns, Lock, Unlock, Database } from "lucide-react";
import StratumCatalog from "@/components/StratumCatalog";

type AppSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AppSidebar = ({ isOpen, onClose }: AppSidebarProps) => {
  const { 
    strata, 
    addStratum, 
    setViewMode, 
    locationLocked, 
    toggleLocationLock
  } = useStratum();
  const [catalogOpen, setCatalogOpen] = useState(false);

  // Create a wrapper function that correctly handles the event
  const handleAddStratum = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Pass no arguments to addStratum, which will use defaults
    addStratum();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex">
      <div className="w-72 bg-card border-r p-0 shadow-md flex flex-col h-screen">
        <SidebarHeader className="border-b">
          <div className="px-4 py-3 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Stratoview</h2>
              <p className="text-xs text-muted-foreground">Urban Data Platform</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <div className="px-4 py-2">
            <h3 className="mb-2 text-sm font-medium">Workspace</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">View Mode</span>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7" 
                    title="Single View"
                    onClick={() => setViewMode("single")}
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7" 
                    title="Column View"
                    onClick={() => setViewMode("columns")}
                  >
                    <Columns className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7" 
                    title="Grid View"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Location Lock</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={toggleLocationLock}
                >
                  {locationLocked ? (
                    <>
                      <Lock className="h-3 w-3" />
                      <span>Locked</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-3 w-3" />
                      <span>Unlocked</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="my-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Strata</h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setCatalogOpen(true)}
                    title="Browse Strata Catalog"
                    disabled={strata.length >= 4}
                  >
                    <Database className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleAddStratum}
                    title="Add New Stratum"
                    disabled={strata.length >= 4}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1">
                {strata.map((stratum) => (
                  <div
                    key={stratum.id}
                    className="flex items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-muted"
                  >
                    <span className="truncate">{stratum.name}</span>
                  </div>
                ))}
                {strata.length === 0 && (
                  <div className="text-xs text-muted-foreground py-2 text-center">
                    No strata added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <p className="text-xs text-muted-foreground">
            Stratoview Alpha v0.1
          </p>
        </SidebarFooter>
      </div>
      <div className="flex-1 bg-black/20" onClick={onClose}></div>
      
      <StratumCatalog 
        isOpen={catalogOpen} 
        onClose={() => setCatalogOpen(false)} 
      />
    </div>
  );
};

export default AppSidebar;
