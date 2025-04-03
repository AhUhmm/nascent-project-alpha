import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useStratum, Stratum, StratumTab, StratumLayout } from "@/contexts/StratumContext";
import { X, Maximize2, Minimize2, Info, Columns3, LayoutGrid, Layers } from "lucide-react";
import { useState } from "react";
import StratumMap from "./StratumMap";
import StratumGraphs from "./StratumGraphs";
import StratumIndex from "./StratumIndex";
import StratumLayersPanel from "./StratumLayersPanel";
import StratumInfoPanel from "./StratumInfoPanel";
import { Toggle } from "@/components/ui/toggle";

type StratumPanelProps = {
  stratum: Stratum;
  isActive: boolean;
};

const StratumPanel = ({ stratum, isActive }: StratumPanelProps) => {
  const { 
    removeStratum, 
    setActiveStratum, 
    setStratumTab, 
    setStratumLayout,
    toggleStratumExpanded,
    viewMode, 
    setViewMode,
    strata,
    previousViewMode
  } = useStratum();
  
  const [layersPanelOpen, setLayersPanelOpen] = useState(false);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);

  const handleTabClick = (tab: StratumTab) => {
    setStratumTab(stratum.id, tab);
  };

  const handleFocus = () => {
    setActiveStratum(stratum.id);
    
    if (!stratum.isExpanded) {
      if (viewMode !== "single") {
        setViewMode("single");
      }
      toggleStratumExpanded(stratum.id);
    } else {
      // When shrinking, revert to the previous viewMode
      if (previousViewMode && previousViewMode !== "single") {
        setViewMode(previousViewMode);
      }
      toggleStratumExpanded(stratum.id);
    }
  };

  const handleLayoutChange = (layout: StratumLayout) => {
    setStratumLayout(stratum.id, layout);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeStratum(stratum.id);
  };

  const handleLayersToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLayersPanelOpen(!layersPanelOpen);
  };

  const handleInfoToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInfoPanelOpen(!infoPanelOpen);
  };

  // Calculate CSS classes based on layout
  const contentClassName = stratum.layout === "side-by-side" 
    ? "flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 relative" 
    : "flex-1 relative";

  // Determine if we should show the layers toggle (only in map view)
  const showLayersToggle = stratum.activeTab === "map" || 
    (stratum.layout === "side-by-side" && stratum.tabs.map.enabled);

  // Determine if we should show the expand/shrink button
  const showExpandShrinkButton = strata.length > 1;

  return (
    <div 
      className={`stratum-panel flex flex-col ${
        isActive ? "ring-2 ring-primary ring-opacity-50" : ""
      } bg-card rounded-md shadow-sm overflow-hidden h-full relative`}
      onClick={() => setActiveStratum(stratum.id)}
    >
      <div className="stratum-panel-header flex justify-between items-center p-2 border-b">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium truncate">{stratum.name}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={handleInfoToggle}
            title="Show Information"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-1">
          {/* Layout toggle button */}
          <div className="flex border rounded-md overflow-hidden">
            <Toggle
              variant="outline"
              size="sm"
              pressed={stratum.layout === "tabs"}
              onPressedChange={() => handleLayoutChange("tabs")}
              className="h-6 px-2 rounded-none border-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              aria-label="Tab Layout"
            >
              <LayoutGrid className="h-4 w-4" />
            </Toggle>
            <Toggle
              variant="outline"
              size="sm"
              pressed={stratum.layout === "side-by-side"}
              onPressedChange={() => handleLayoutChange("side-by-side")}
              className="h-6 px-2 rounded-none border-0 border-l data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              aria-label="Side-by-side Layout"
            >
              <Columns3 className="h-4 w-4" />
            </Toggle>
          </div>
          
          {/* Updated expand/shrink button - only visible when there are multiple strata */}
          {showExpandShrinkButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handleFocus}
              title={stratum.isExpanded ? "Shrink" : "Expand"}
            >
              {stratum.isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={handleRemove}
            title="Remove Stratum"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {stratum.layout === "tabs" ? (
        <Tabs 
          defaultValue={stratum.activeTab} 
          value={stratum.activeTab}
          className="flex flex-col flex-1"
        >
          <TabsList className="px-2 pt-2 justify-start bg-transparent">
            {stratum.tabs.map.enabled && (
              <TabsTrigger 
                value="map" 
                onClick={() => handleTabClick("map")}
                className="font-medium px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
              >
                Map
              </TabsTrigger>
            )}
            
            {stratum.tabs.graphs.enabled && (
              <TabsTrigger 
                value="graphs" 
                onClick={() => handleTabClick("graphs")}
                className="font-medium px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
              >
                Graphs
              </TabsTrigger>
            )}
            
            {stratum.tabs.index.enabled && (
              <TabsTrigger 
                value="index" 
                onClick={() => handleTabClick("index")}
                className="font-medium px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
              >
                Index
              </TabsTrigger>
            )}
          </TabsList>
          
          <div className="flex-1 p-2">
            {stratum.activeTab === "map" && (
              <TabsContent value="map" className="h-full m-0 mt-0 data-[state=active]:h-full">
                <StratumMap stratum={stratum} />
              </TabsContent>
            )}
            {stratum.activeTab === "graphs" && (
              <TabsContent value="graphs" className="h-full m-0 mt-0 data-[state=active]:h-full">
                <StratumGraphs stratum={stratum} />
              </TabsContent>
            )}
            {stratum.activeTab === "index" && (
              <TabsContent value="index" className="h-full m-0 mt-0 data-[state=active]:h-full">
                <StratumIndex stratum={stratum} />
              </TabsContent>
            )}
          </div>
        </Tabs>
      ) : (
        <div className={contentClassName}>
          {stratum.tabs.map.enabled && (
            <div className="h-full">
              <div className={`p-2 border-b text-sm font-medium ${stratum.activeTab === "map" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>Map</div>
              <div className="p-2 h-[calc(100%-2.5rem)]">
                <StratumMap stratum={stratum} />
              </div>
            </div>
          )}
          
          {stratum.tabs.graphs.enabled && (
            <div className="h-full">
              <div className={`p-2 border-b text-sm font-medium ${stratum.activeTab === "graphs" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>Graphs</div>
              <div className="p-2 h-[calc(100%-2.5rem)]">
                <StratumGraphs stratum={stratum} />
              </div>
            </div>
          )}
          
          {stratum.tabs.index.enabled && (
            <div className="h-full">
              <div className={`p-2 border-b text-sm font-medium ${stratum.activeTab === "index" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>Index</div>
              <div className="p-2 h-[calc(100%-2.5rem)]">
                <StratumIndex stratum={stratum} />
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Panels */}
      {layersPanelOpen && isActive && stratum.tabs.map.enabled && (
        <StratumLayersPanel 
          stratumId={stratum.id} 
          layers={stratum.tabs.map.layers} 
          onClose={() => setLayersPanelOpen(false)} 
        />
      )}
      
      {infoPanelOpen && (
        <StratumInfoPanel 
          stratum={stratum}
          onClose={() => setInfoPanelOpen(false)} 
        />
      )}

      {/* Layers Toggle Button - only show when in map view */}
      {showLayersToggle && (
        <div className="absolute bottom-3 right-3 z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              setLayersPanelOpen(!layersPanelOpen);
            }}
            title="Toggle Layers Panel"
          >
            <Layers className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default StratumPanel;
