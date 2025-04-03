
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Save, FolderPlus, FilePlus, PlusCircle } from "lucide-react";
import { useStratum } from "@/contexts/StratumContext";

type AppSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AppSidebar = ({ isOpen, onClose }: AppSidebarProps) => {
  const { addStratum, strata } = useStratum();

  return (
    <div 
      className={`fixed inset-y-0 left-0 w-64 bg-sidebar z-30 border-r transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-14 border-b flex items-center justify-between px-4">
        <h2 className="font-semibold">Project Controls</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100%-3.5rem)] p-4">
        <div className="space-y-6">
          <section>
            <h3 className="font-medium mb-3 text-sm text-muted-foreground">Project</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Save className="h-4 w-4 mr-2" />
                Save Project
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Project
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FilePlus className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </section>
          
          <section>
            <h3 className="font-medium mb-3 text-sm text-muted-foreground">Strata</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={addStratum}
                disabled={strata.length >= 4}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Stratum
              </Button>
              
              {strata.map((stratum) => (
                <div 
                  key={stratum.id} 
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <span className="text-sm font-medium">Stratum {stratum.id.slice(0, 4)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AppSidebar;
