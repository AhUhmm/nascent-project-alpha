
import { useStratum, Stratum } from "@/contexts/StratumContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type StratumInfoPanelProps = {
  stratum: Stratum;
  onClose: () => void;
};

const StratumInfoPanel = ({ stratum, onClose }: StratumInfoPanelProps) => {
  return (
    <div className="absolute inset-0 bg-background/95 z-20 p-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Information: {stratum.name}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <section>
          <h4 className="font-medium mb-2">Location</h4>
          <p>Name: {stratum.location.name}</p>
          <p>Coordinates: {stratum.location.coordinates.join(', ')}</p>
        </section>
        
        <section>
          <h4 className="font-medium mb-2">Data Summary</h4>
          <p>Active view: {stratum.activeTab}</p>
          <p>Layout type: {stratum.layout}</p>
          
          {stratum.tabs.index.enabled && (
            <div className="mt-2">
              <p>Index value: {stratum.tabs.index.value}</p>
              <p>Description: {stratum.tabs.index.description}</p>
              
              <div className="mt-2">
                <h5 className="text-sm font-medium mb-1">Components:</h5>
                <ul className="list-disc pl-5">
                  {stratum.tabs.index.components.map((component, i) => (
                    <li key={i}>
                      {component.name}: {component.value} (weight: {component.weight * 100}%)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
        
        {stratum.tabs.map.enabled && (
          <section>
            <h4 className="font-medium mb-2">Map Layers</h4>
            <ul className="list-disc pl-5">
              {stratum.tabs.map.layers.map((layer) => (
                <li key={layer.id} className={layer.visible ? "text-primary" : "text-muted-foreground"}>
                  {layer.name} ({layer.type})
                </li>
              ))}
            </ul>
          </section>
        )}
        
        <div className="text-sm text-muted-foreground mt-4 pt-4 border-t">
          <p>This panel can be customized to display additional information about the stratum.</p>
        </div>
      </div>
    </div>
  );
};

export default StratumInfoPanel;
