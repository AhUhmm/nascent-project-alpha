
import React from "react";
import { useStratum } from "@/contexts/StratumContext";
import StratumPanel from "./StratumPanel";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const StratumLayout = () => {
  const { strata, viewMode, activeStratumId } = useStratum();

  // Filter strata based on view mode
  const visibleStrata = viewMode === "single" 
    ? strata.filter(s => s.id === activeStratumId)
    : strata;

  // Render a resizable layout when multiple strata are visible
  if (visibleStrata.length > 1 && viewMode === "columns") {
    return (
      <div className="h-full p-4">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full rounded-lg"
        >
          {visibleStrata.map((stratum, index) => (
            <React.Fragment key={stratum.id}>
              <ResizablePanel 
                defaultSize={100 / visibleStrata.length} 
                minSize={15} // Set minimum size to 15% of the container width
              >
                <StratumPanel
                  stratum={stratum}
                  isActive={stratum.id === activeStratumId}
                />
              </ResizablePanel>
              {index < visibleStrata.length - 1 && (
                <ResizableHandle withHandle />
              )}
            </React.Fragment>
          ))}
        </ResizablePanelGroup>
      </div>
    );
  }

  // For grid view with multiple strata, use resizable panels
  if (visibleStrata.length > 1 && viewMode === "grid") {
    // For 2 strata in grid view, use horizontal layout
    if (visibleStrata.length === 2) {
      return (
        <div className="h-full p-4">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full rounded-lg"
          >
            {visibleStrata.map((stratum, index) => (
              <React.Fragment key={stratum.id}>
                <ResizablePanel 
                  defaultSize={50} 
                  minSize={15} // Set minimum size to 15% of the container width
                >
                  <StratumPanel
                    stratum={stratum}
                    isActive={stratum.id === activeStratumId}
                  />
                </ResizablePanel>
                {index < visibleStrata.length - 1 && (
                  <ResizableHandle withHandle />
                )}
              </React.Fragment>
            ))}
          </ResizablePanelGroup>
        </div>
      );
    }
    
    // For 3 or 4 strata in grid view, use a nested layout
    return (
      <div className="h-full p-4">
        <ResizablePanelGroup
          direction="vertical"
          className="h-full rounded-lg"
        >
          {/* Top row */}
          <ResizablePanel defaultSize={50} minSize={15}>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50} minSize={15}>
                <StratumPanel
                  stratum={visibleStrata[0]}
                  isActive={visibleStrata[0].id === activeStratumId}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={15}>
                <StratumPanel
                  stratum={visibleStrata[1]}
                  isActive={visibleStrata[1].id === activeStratumId}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          
          {/* Only add bottom row if we have 3 or 4 strata */}
          {visibleStrata.length > 2 && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={15}>
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel defaultSize={50} minSize={15}>
                    <StratumPanel
                      stratum={visibleStrata[2]}
                      isActive={visibleStrata[2].id === activeStratumId}
                    />
                  </ResizablePanel>
                  
                  {/* Only add the fourth panel if we have 4 strata */}
                  {visibleStrata.length === 4 && (
                    <>
                      <ResizableHandle withHandle />
                      <ResizablePanel defaultSize={50} minSize={15}>
                        <StratumPanel
                          stratum={visibleStrata[3]}
                          isActive={visibleStrata[3].id === activeStratumId}
                        />
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    );
  }

  // For single stratum view, use the original layout
  // Determine grid layout classes based on view mode and strata count
  const getLayoutClasses = () => {
    const count = strata.length;
    
    switch (viewMode) {
      case "single":
        return "grid-cols-1";
      case "grid":
        return "grid-cols-1 md:grid-cols-2";
      case "columns":
        if (count === 2) {
          return "grid-cols-1 md:grid-cols-2";
        } else if (count === 3) {
          return "grid-cols-1 md:grid-cols-3";
        } else {
          return "grid-cols-1 md:grid-cols-4";
        }
      default:
        return "grid-cols-1";
    }
  };

  return (
    <div className={`grid ${getLayoutClasses()} gap-4 h-full p-4`}>
      {visibleStrata.map((stratum) => (
        <StratumPanel
          key={stratum.id}
          stratum={stratum}
          isActive={stratum.id === activeStratumId}
        />
      ))}
    </div>
  );
};

export default StratumLayout;
