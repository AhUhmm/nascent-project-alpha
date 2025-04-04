
import React, { createContext, useContext, useState, ReactNode } from "react";

// ViewMode types
export type ViewMode = "single" | "grid" | "columns";

// Layout types
export type StratumLayout = "tabs" | "side-by-side";

// Layer types
export type MapLayer = {
  id: string;
  name: string;
  visible: boolean;
  type: "point" | "line" | "polygon" | "heatmap" | "raster";
};

// Tab types
export type StratumTab = "map" | "graphs" | "index";

// Stratum type
export type Stratum = {
  id: string;
  name: string;
  location: {
    name: string;
    coordinates: [number, number];
  };
  activeTab: StratumTab;
  layout: StratumLayout;
  isExpanded: boolean;
  tabs: {
    map: {
      enabled: boolean;
      layers: MapLayer[];
    };
    graphs: {
      enabled: boolean;
      data: any[]; // This would be more specific in a real application
    };
    index: {
      enabled: boolean;
      value: number;
      description: string;
      components: {
        name: string;
        value: number;
        weight: number;
      }[];
    };
  };
};

// Context type
type StratumContextType = {
  strata: Stratum[];
  activeStratumId: string | null;
  viewMode: ViewMode;
  previousViewMode: ViewMode | null;
  locationLocked: boolean;
  setViewMode: (mode: ViewMode) => void;
  addStratum: (options?: {
    name?: string;
    enabledTabs?: {
      map?: boolean;
      graphs?: boolean;
      index?: boolean;
    };
    location?: {
      name: string;
      coordinates: [number, number];
    };
    description?: string;
  }) => void;
  removeStratum: (id: string) => void;
  setActiveStratum: (id: string | null) => void;
  updateStratum: (id: string, updates: Partial<Stratum>) => void;
  setStratumTab: (id: string, tab: StratumTab) => void;
  setStratumLayout: (id: string, layout: StratumLayout) => void;
  toggleStratumExpanded: (id: string) => void;
  toggleLayer: (stratumId: string, layerId: string) => void;
  searchLocation: (query: string, stratumId: string) => void;
  toggleLocationLock: () => void;
  syncLocation: (location: { name: string; coordinates: [number, number] }) => void;
};

// Default map layers
const defaultLayers: MapLayer[] = [
  { id: "base", name: "Base Map", visible: true, type: "raster" },
  { id: "population", name: "Population Density", visible: false, type: "heatmap" },
  { id: "roads", name: "Roads", visible: false, type: "line" },
  { id: "buildings", name: "Buildings", visible: false, type: "polygon" },
  { id: "poi", name: "Points of Interest", visible: false, type: "point" },
];

// Default stratum
const createDefaultStratum = (id: string, index: number, options?: {
  name?: string;
  enabledTabs?: {
    map?: boolean;
    graphs?: boolean;
    index?: boolean;
  };
  location?: {
    name: string;
    coordinates: [number, number];
  };
  description?: string;
}): Stratum => ({
  id,
  name: options?.name || `Stratum ${index + 1}`,
  location: options?.location || {
    name: "New York",
    coordinates: [-74.006, 40.7128],
  },
  activeTab: options?.enabledTabs?.map === false 
    ? (options?.enabledTabs?.graphs === false ? "index" : "graphs") 
    : "map",
  layout: "tabs",
  isExpanded: false,
  tabs: {
    map: {
      enabled: options?.enabledTabs?.map !== false,
      layers: [...defaultLayers],
    },
    graphs: {
      enabled: options?.enabledTabs?.graphs !== false,
      data: [],
    },
    index: {
      enabled: options?.enabledTabs?.index !== false,
      value: 72,
      description: options?.description || "Overall performance index based on multiple factors",
      components: [
        { name: "Environmental", value: 65, weight: 0.3 },
        { name: "Economic", value: 78, weight: 0.4 },
        { name: "Social", value: 70, weight: 0.3 },
      ],
    },
  },
});

// Create the Climate Impact Assessment stratum as initial default
const createClimateImpactStratum = (): Stratum => ({
  id: "stratum-1",
  name: "Climate Impact Assessment",
  location: {
    name: "Seattle",
    coordinates: [-122.3321, 47.6062],
  },
  activeTab: "map",
  layout: "tabs",
  isExpanded: false,
  tabs: {
    map: {
      enabled: true,
      layers: [...defaultLayers],
    },
    graphs: {
      enabled: true,
      data: [],
    },
    index: {
      enabled: true,
      value: 68,
      description: "Comprehensive assessment of climate change impacts on local ecosystems, with projections for future scenarios and adaptation strategies.",
      components: [
        { name: "Vulnerability", value: 72, weight: 0.4 },
        { name: "Adaptation", value: 65, weight: 0.3 },
        { name: "Mitigation", value: 67, weight: 0.3 },
      ],
    },
  },
});

// Create the context
const StratumContext = createContext<StratumContextType | undefined>(undefined);

// Context provider
export const StratumProvider = ({ children }: { children: ReactNode }) => {
  const [strata, setStrata] = useState<Stratum[]>([
    createClimateImpactStratum(), // Use Climate Impact Assessment as the initial stratum
  ]);
  const [activeStratumId, setActiveStratumId] = useState<string | null>("stratum-1");
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [previousViewMode, setPreviousViewMode] = useState<ViewMode | null>(null);
  const [locationLocked, setLocationLocked] = useState<boolean>(false);

  // Add a new stratum
  const addStratum = (options?: {
    name?: string;
    enabledTabs?: {
      map?: boolean;
      graphs?: boolean;
      index?: boolean;
    };
    location?: {
      name: string;
      coordinates: [number, number];
    };
    description?: string;
  }) => {
    if (strata.length >= 4) return; // Maximum 4 strata
    
    const newStratum = createDefaultStratum(`stratum-${strata.length + 1}`, strata.length, options);
    
    // If location is locked, sync the new stratum's location with others
    if (locationLocked && strata.length > 0 && !options?.location) {
      newStratum.location = {...strata[0].location};
    }
    
    setStrata([...strata, newStratum]);
    
    // Set view mode based on number of strata
    updateViewModeBasedOnCount(strata.length + 1);
    
    // If we're in single view, make the new stratum active
    if (viewMode === "single") {
      setActiveStratumId(newStratum.id);
    }
  };

  // Remove a stratum
  const removeStratum = (id: string) => {
    if (strata.length <= 1) return; // Keep at least one stratum
    
    const newStrata = strata.filter((s) => s.id !== id);
    setStrata(newStrata);
    
    // Update view mode based on new count
    updateViewModeBasedOnCount(newStrata.length);
    
    // If removing active stratum, set the first one as active
    if (activeStratumId === id) {
      setActiveStratumId(newStrata[0].id);
    }
  };

  // Update view mode based on strata count
  const updateViewModeBasedOnCount = (count: number) => {
    if (count === 1) {
      setViewMode("single");
    } else if (count === 2 || count === 3) {
      setViewMode("columns");
    } else if (count === 4) {
      setViewMode("grid");
    }
  };

  // Update a stratum
  const updateStratum = (id: string, updates: Partial<Stratum>) => {
    // If location is being updated and lock is on, update all strata
    if (locationLocked && updates.location) {
      setStrata(
        strata.map((stratum) => ({
          ...stratum,
          location: updates.location as { name: string; coordinates: [number, number] }
        }))
      );
    } else {
      setStrata(
        strata.map((stratum) =>
          stratum.id === id ? { ...stratum, ...updates } : stratum
        )
      );
    }
  };

  // Custom setViewMode that tracks previous view mode
  const setViewModeWithHistory = (mode: ViewMode) => {
    if (mode !== viewMode) {
      setPreviousViewMode(viewMode);
      setViewMode(mode);
    }
  };

  // Set active stratum tab
  const setStratumTab = (id: string, tab: StratumTab) => {
    setStrata(
      strata.map((stratum) =>
        stratum.id === id
          ? { ...stratum, activeTab: tab }
          : stratum
      )
    );
  };

  // Set stratum layout (tabs or side-by-side)
  const setStratumLayout = (id: string, layout: StratumLayout) => {
    setStrata(
      strata.map((stratum) =>
        stratum.id === id
          ? { ...stratum, layout }
          : stratum
      )
    );
  };

  // Toggle stratum expanded state
  const toggleStratumExpanded = (id: string) => {
    setStrata(
      strata.map((stratum) =>
        stratum.id === id
          ? { ...stratum, isExpanded: !stratum.isExpanded }
          : stratum
      )
    );
  };

  // Toggle layer visibility
  const toggleLayer = (stratumId: string, layerId: string) => {
    setStrata(
      strata.map((stratum) =>
        stratum.id === stratumId
          ? {
              ...stratum,
              tabs: {
                ...stratum.tabs,
                map: {
                  ...stratum.tabs.map,
                  layers: stratum.tabs.map.layers.map((layer) =>
                    layer.id === layerId
                      ? { ...layer, visible: !layer.visible }
                      : layer
                  ),
                },
              },
            }
          : stratum
      )
    );
  };

  // Toggle location lock state
  const toggleLocationLock = () => {
    if (!locationLocked && strata.length > 1) {
      // When enabling lock, sync all locations to the active stratum
      const activeStratum = strata.find(s => s.id === activeStratumId);
      if (activeStratum) {
        syncLocation(activeStratum.location);
      }
    }
    setLocationLocked(!locationLocked);
  };

  // Sync location across all strata
  const syncLocation = (location: { name: string; coordinates: [number, number] }) => {
    setStrata(
      strata.map((stratum) => ({
        ...stratum,
        location: { ...location }
      }))
    );
  };

  // Search location (simplified for now)
  const searchLocation = (query: string, stratumId: string) => {
    // In a real app, this would make an API call to a geocoding service
    console.log(`Searching for location: ${query} for stratum ${stratumId}`);
    
    // Mock response for demo
    const mockLocation = {
      name: query,
      coordinates: [
        -74.006 + (Math.random() - 0.5) * 10, // Add some randomness
        40.7128 + (Math.random() - 0.5) * 10,
      ] as [number, number],
    };
    
    if (locationLocked) {
      // Update all strata with the same location
      syncLocation(mockLocation);
    } else {
      // Update only the specific stratum
      updateStratum(stratumId, { location: mockLocation });
    }
  };

  const value = {
    strata,
    activeStratumId,
    viewMode,
    previousViewMode,
    locationLocked,
    setViewMode: setViewModeWithHistory,
    addStratum,
    removeStratum,
    setActiveStratum: setActiveStratumId,
    updateStratum,
    setStratumTab,
    setStratumLayout,
    toggleStratumExpanded,
    toggleLayer,
    searchLocation,
    toggleLocationLock,
    syncLocation,
  };

  return (
    <StratumContext.Provider value={value}>
      {children}
    </StratumContext.Provider>
  );
};

// Custom hook to use the context
export const useStratum = () => {
  const context = useContext(StratumContext);
  if (context === undefined) {
    throw new Error("useStratum must be used within a StratumProvider");
  }
  return context;
};
