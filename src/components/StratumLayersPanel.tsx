
import { useStratum, MapLayer } from "@/contexts/StratumContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

type StratumLayersPanelProps = {
  stratumId: string;
  layers: MapLayer[];
  onClose: () => void;
};

const StratumLayersPanel = ({ stratumId, layers, onClose }: StratumLayersPanelProps) => {
  const { toggleLayer } = useStratum();

  const handleToggleLayer = (layerId: string) => {
    toggleLayer(stratumId, layerId);
  };
  
  const getLayerIcon = (type: MapLayer["type"]) => {
    switch (type) {
      case "point":
        return "●";
      case "line":
        return "―";
      case "polygon":
        return "▢";
      case "heatmap":
        return "◍";
      case "raster":
        return "◫";
      default:
        return "●";
    }
  };

  return (
    <div className="absolute bottom-14 right-3 w-64 bg-card border shadow-md z-10 rounded-md">
      <div className="flex items-center justify-between p-3 border-b">
        <h4 className="font-medium text-sm">Map Layers</h4>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
        {layers.map((layer) => (
          <div key={layer.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">{getLayerIcon(layer.type)}</span>
              <span className="text-sm">{layer.name}</span>
            </div>
            <Switch
              checked={layer.visible}
              onCheckedChange={() => handleToggleLayer(layer.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StratumLayersPanel;
