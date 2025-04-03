
import { useState, useEffect, useRef } from "react";
import { Stratum, useStratum } from "@/contexts/StratumContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Layers } from "lucide-react";

type StratumMapProps = {
  stratum: Stratum;
};

// Mock map component (in a real app, this would use a library like Mapbox GL, Leaflet, etc.)
const StratumMap = ({ stratum }: StratumMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(10);
  const { locationLocked, syncLocation, updateStratum } = useStratum();
  
  useEffect(() => {
    // In a real app, this would initialize the map library
    console.log(`Initializing map for ${stratum.name} at ${stratum.location.name}`);
    
    // Mock map initialization
    if (mapRef.current) {
      const mockMapContainer = mapRef.current;
      
      // Create a simple visual to represent the map
      mockMapContainer.innerHTML = "";
      const mapVisual = document.createElement("div");
      mapVisual.className = "absolute inset-0 bg-stratum-light bg-opacity-50";
      
      // Add grid lines to simulate a map
      for (let i = 0; i < 10; i++) {
        const horizontalLine = document.createElement("div");
        horizontalLine.className = "absolute w-full h-px bg-gray-300";
        horizontalLine.style.top = `${i * 10}%`;
        mapVisual.appendChild(horizontalLine);
        
        const verticalLine = document.createElement("div");
        verticalLine.className = "absolute h-full w-px bg-gray-300";
        verticalLine.style.left = `${i * 10}%`;
        mapVisual.appendChild(verticalLine);
      }
      
      // Add location marker
      const marker = document.createElement("div");
      marker.className = "absolute w-4 h-4 bg-stratum-blue rounded-full transform -translate-x-1/2 -translate-y-1/2";
      marker.style.left = "50%";
      marker.style.top = "50%";
      marker.style.boxShadow = "0 0 0 4px rgba(30, 136, 229, 0.3)";
      mapVisual.appendChild(marker);
      
      // Add location name
      const locationLabel = document.createElement("div");
      locationLabel.className = "absolute text-xs font-semibold bg-white px-2 py-1 rounded shadow-sm transform -translate-x-1/2";
      locationLabel.style.left = "50%";
      locationLabel.style.top = "calc(50% + 12px)";
      locationLabel.textContent = stratum.location.name;
      mapVisual.appendChild(locationLabel);
      
      // Show active layers - updated position to align with bottom location label
      const activeLayers = stratum.tabs.map.layers.filter(l => l.visible);
      if (activeLayers.length > 0) {
        const layersInfo = document.createElement("div");
        layersInfo.className = "absolute bottom-2 right-14 text-xs bg-white bg-opacity-80 px-2 py-1 rounded";
        layersInfo.textContent = `Active layers: ${activeLayers.map(l => l.name).join(", ")}`;
        mapVisual.appendChild(layersInfo);
      }
      
      // Add event listener for map drag to simulate location change
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      
      mapVisual.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
      });
      
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        // Calculate movement
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;
        
        // In a real map library, this would change the center
        // For our mock, we'll update the location's coordinates
        const newCoords: [number, number] = [
          stratum.location.coordinates[0] - deltaX * 0.01,
          stratum.location.coordinates[1] + deltaY * 0.01
        ];
        
        // If location is locked, sync all maps
        if (locationLocked) {
          syncLocation({
            name: stratum.location.name,
            coordinates: newCoords
          });
        } else {
          // Otherwise, only update this stratum
          updateStratum(stratum.id, {
            location: {
              name: stratum.location.name,
              coordinates: newCoords
            }
          });
        }
      });
      
      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
      
      mockMapContainer.appendChild(mapVisual);
    }
  }, [stratum.id, stratum.location, stratum.tabs.map.layers, zoom, locationLocked, syncLocation, updateStratum]);
  
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, 20));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, 1));
  };

  return (
    <div className="relative w-full h-full bg-stratum-light">
      <div ref={mapRef} className="absolute inset-0" />
      
      <div className="stratum-map-controls">
        <Button variant="outline" size="icon" className="stratum-control-button" onClick={handleZoomIn}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="stratum-control-button" onClick={handleZoomOut}>
          <Minus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        {stratum.location.name} ({stratum.location.coordinates[1].toFixed(4)}, {stratum.location.coordinates[0].toFixed(4)})
      </div>
    </div>
  );
};

export default StratumMap;
