
import { useState, useEffect } from "react";
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronRight, 
  Map, 
  BarChart, 
  List, 
  Search, 
  Filter,
  X,
  SortAsc,
  SortDesc,
  ChevronDown,
  Eye,
  Plus,
  ArrowLeft
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStratum } from "@/contexts/StratumContext";
import StratumInfoPanel from "./StratumInfoPanel";

// Mock data for the Stratum catalog
const mockStratumItems = [
  {
    id: 1,
    title: "Urban Development Trends",
    institution: "City Planning Institute",
    description: "Analysis of urban development patterns across major metropolitan areas, with focus on sustainable growth and infrastructure planning.",
    previews: ["/placeholder.svg", "/placeholder.svg"],
    contents: ["map", "graphs", "index"] as ("map" | "graphs" | "index")[],
    tags: ["urban", "planning", "development", "sustainability"],
    location: {
      name: "New York",
      coordinates: [40.7128, -74.0060] as [number, number]
    }
  },
  {
    id: 2,
    title: "Climate Impact Assessment",
    institution: "Environmental Research Center",
    description: "Comprehensive assessment of climate change impacts on local ecosystems, with projections for future scenarios and adaptation strategies.",
    previews: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    contents: ["map", "graphs", "index"] as ("map" | "graphs" | "index")[],
    tags: ["climate", "environment", "research", "adaptation"],
    location: {
      name: "Seattle",
      coordinates: [47.6062, -122.3321] as [number, number]
    }
  },
  {
    id: 3,
    title: "Transportation Network Analysis",
    institution: "Urban Mobility Lab",
    description: "Analysis of public transportation networks and traffic patterns, identifying bottlenecks and opportunities for optimization.",
    previews: ["/placeholder.svg"],
    contents: ["map", "graphs"] as ("map" | "graphs" | "index")[],
    tags: ["transportation", "mobility", "urban", "traffic"],
    location: {
      name: "Chicago",
      coordinates: [41.8781, -87.6298] as [number, number]
    }
  },
  {
    id: 4,
    title: "Population Demographics Study",
    institution: "Social Sciences Department",
    description: "Detailed demographic analysis examining population distribution, density, age groups, and migration patterns across regions.",
    previews: ["/placeholder.svg", "/placeholder.svg"],
    contents: ["map", "index"] as ("map" | "graphs" | "index")[],
    tags: ["demographics", "population", "social", "migration"],
    location: {
      name: "Los Angeles",
      coordinates: [34.0522, -118.2437] as [number, number]
    }
  },
  {
    id: 5,
    title: "Economic Development Indicators",
    institution: "Economic Research Institute",
    description: "Economic indicators tracking across multiple dimensions including employment, growth sectors, and investment patterns.",
    previews: ["/placeholder.svg"],
    contents: ["graphs", "index"] as ("map" | "graphs" | "index")[],
    tags: ["economy", "development", "finance", "indicators"],
    location: {
      name: "Boston",
      coordinates: [42.3601, -71.0589] as [number, number]
    }
  },
  {
    id: 6,
    title: "Land Use Classification",
    institution: "Geographic Information Systems Lab",
    description: "Detailed classification of land use patterns, zoning regulations, and development opportunities in urban and suburban areas.",
    previews: ["/placeholder.svg", "/placeholder.svg"],
    contents: ["map", "index"] as ("map" | "graphs" | "index")[],
    tags: ["land use", "gis", "zoning", "classification"],
    location: {
      name: "San Francisco",
      coordinates: [37.7749, -122.4194] as [number, number]
    }
  },
];

type StratumItemType = {
  id: number;
  title: string;
  institution: string;
  description: string;
  previews: string[];
  contents: ("map" | "graphs" | "index")[];
  tags: string[];
  location: {
    name: string;
    coordinates: [number, number];
  };
};

type StratumCatalogProps = {
  isOpen: boolean;
  onClose: () => void;
};

type SortOption = "newest" | "alphabetical" | "relevance";

const StratumCatalog = ({ isOpen, onClose }: StratumCatalogProps) => {
  const { addStratum, strata } = useStratum();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "map" | "graphs" | "index">("all");
  const [items, setItems] = useState<StratumItemType[]>(mockStratumItems);
  const [selectedItem, setSelectedItem] = useState<StratumItemType | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [showItemInfo, setShowItemInfo] = useState(false);

  // Get unique institutions from the mock data
  const uniqueInstitutions = Array.from(new Set(mockStratumItems.map(item => item.institution)));
  
  // Get unique tags from the mock data
  const uniqueTags = Array.from(
    new Set(mockStratumItems.flatMap(item => item.tags))
  ).sort();

  // Handle search and filtering
  useEffect(() => {
    let filteredItems = [...mockStratumItems];
    
    // Apply search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(searchTermLower) ||
        item.institution.toLowerCase().includes(searchTermLower) ||
        item.description.toLowerCase().includes(searchTermLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }
    
    // Apply content type filter
    if (activeFilter !== "all") {
      filteredItems = filteredItems.filter(item => 
        item.contents.includes(activeFilter as "map" | "graphs" | "index")
      );
    }
    
    // Apply institution filter
    if (selectedInstitutions.length > 0) {
      filteredItems = filteredItems.filter(item => 
        selectedInstitutions.includes(item.institution)
      );
    }
    
    // Apply tag filter
    if (selectedTags.length > 0) {
      filteredItems = filteredItems.filter(item => 
        item.tags.some(tag => selectedTags.includes(tag))
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case "alphabetical":
        filteredItems.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "relevance":
        // In a real app, this would be more sophisticated
        // For now, just prioritize items with more matches to the search term
        if (searchTerm) {
          filteredItems.sort((a, b) => {
            const aMatches = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;
            const bMatches = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;
            return bMatches - aMatches;
          });
        }
        break;
      case "newest":
      default:
        // In a mock scenario, we'll just use the ID as a proxy for "newest"
        filteredItems.sort((a, b) => b.id - a.id);
        break;
    }
    
    setItems(filteredItems);
  }, [searchTerm, activeFilter, selectedInstitutions, selectedTags, sortOption]);

  const handleSelectItem = (item: StratumItemType) => {
    setSelectedItem(item);
  };

  const handleAddStratum = () => {
    if (strata.length >= 4) {
      return;
    }
    
    addStratum();
    onClose();
  };

  // This function resets the view to the catalog browser
  const resetView = () => {
    setSelectedItem(null);
    setShowItemInfo(false);
  };

  const toggleInstitution = (institution: string) => {
    setSelectedInstitutions(prev => 
      prev.includes(institution)
        ? prev.filter(i => i !== institution)
        : [...prev, institution]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const renderContentIcon = (type: string) => {
    switch (type) {
      case "map":
        return <Map className="h-4 w-4 text-blue-500" />;
      case "graphs":
        return <BarChart className="h-4 w-4 text-purple-500" />;
      case "index":
        return <List className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        } else {
          // When reopening, always reset to the catalog view
          resetView();
        }
      }}
    >
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        
        <div className="flex flex-col flex-1 overflow-hidden">
          {selectedItem && showItemInfo ? (
            
            <div className="h-full">
              <StratumInfoPanel 
                stratum={{
                  id: selectedItem.id.toString(),
                  name: selectedItem.title,
                  location: {
                    name: selectedItem.location.name,
                    coordinates: selectedItem.location.coordinates
                  },
                  layout: "tabs",
                  activeTab: selectedItem.contents.includes("map") ? "map" : selectedItem.contents.includes("graphs") ? "graphs" : "index",
                  isExpanded: false,
                  tabs: {
                    map: {
                      enabled: selectedItem.contents.includes("map"),
                      layers: [
                        { id: "1", name: "Base Layer", type: "raster", visible: true },
                        { id: "2", name: "Overlay", type: "polygon", visible: true }
                      ]
                    },
                    graphs: {
                      enabled: selectedItem.contents.includes("graphs"),
                      data: []
                    },
                    index: {
                      enabled: selectedItem.contents.includes("index"),
                      value: 72,
                      description: "A composite index based on multiple urban development factors",
                      components: [
                        { name: "Infrastructure", value: 65, weight: 0.3 },
                        { name: "Sustainability", value: 80, weight: 0.4 },
                        { name: "Accessibility", value: 70, weight: 0.3 }
                      ]
                    }
                  }
                }}
                onClose={() => setShowItemInfo(false)}
              />
            </div>
          ) : selectedItem ? (
            
            <div className="flex flex-col h-full overflow-auto">
              <Button 
                variant="ghost" 
                className="self-start flex items-center mb-4" 
                onClick={() => setSelectedItem(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to catalogue
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                    {selectedItem.previews.length > 0 ? (
                      <img 
                        src={selectedItem.previews[0]} 
                        alt={selectedItem.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No preview available
                      </div>
                    )}
                  </div>
                  
                  {selectedItem.previews.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {selectedItem.previews.slice(1).map((preview, index) => (
                        <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={preview} 
                            alt={`${selectedItem.title} preview ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedItem.title}</h3>
                    <p className="text-muted-foreground">{selectedItem.institution}</p>
                    <p className="text-sm text-muted-foreground mt-1">Location: {selectedItem.location.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Contents</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.contents.map((content, index) => (
                        <Badge key={index} variant="outline" className="flex items-center">
                          {renderContentIcon(content)}
                          <span className="ml-1 capitalize">{content}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      className="w-full" 
                      onClick={handleAddStratum}
                      disabled={strata.length >= 4}
                    >
                      Add This Stratum
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowItemInfo(true)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View More Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl font-bold">Strata Catalogue</DialogTitle>
                <DialogDescription className="mt-2">
                  Browse and select from available strata to add to your workspace
                </DialogDescription>
              </DialogHeader>
            
              <div className="flex flex-col gap-5 mb-4">
                {/* Search box with improved spacing */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text"
                    placeholder="Search strata..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Reorganized filters section with better visual grouping */}
                <div className="flex flex-col gap-3">
                  {/* Primary filters in one row */}
                  <div className="flex items-center flex-wrap gap-2">
                    <Tabs defaultValue="all" onValueChange={(value) => setActiveFilter(value as any)}>
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="map">Maps</TabsTrigger>
                        <TabsTrigger value="graphs">Data Viz</TabsTrigger>
                        <TabsTrigger value="index">Indexes</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    {/* Institution filter */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          Institution
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2" align="start">
                        <div className="space-y-2">
                          {uniqueInstitutions.map((institution) => (
                            <div key={institution} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`institution-${institution}`} 
                                checked={selectedInstitutions.includes(institution)}
                                onCheckedChange={() => toggleInstitution(institution)}
                              />
                              <label 
                                htmlFor={`institution-${institution}`}
                                className="text-sm cursor-pointer truncate"
                              >
                                {institution}
                              </label>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    {/* Tags filter */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          Tags
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2" align="start">
                        <div className="max-h-60 overflow-auto space-y-2">
                          {uniqueTags.map((tag) => (
                            <div key={tag} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`tag-${tag}`} 
                                checked={selectedTags.includes(tag)}
                                onCheckedChange={() => toggleTag(tag)}
                              />
                              <label 
                                htmlFor={`tag-${tag}`}
                                className="text-sm cursor-pointer truncate"
                              >
                                {tag}
                              </label>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Secondary row with display options and advanced filters */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className="gap-1"
                    >
                      <Filter className="h-4 w-4" />
                      {showAdvancedFilters ? "Hide Filters" : "Advanced Filters"}
                    </Button>
                    
                    {/* Display options and sort grouped together */}
                    <div className="flex items-center gap-2">
                      {/* Sort dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <SortAsc className="h-4 w-4" />
                            Sort
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => setSortOption("newest")}
                            className={sortOption === "newest" ? "bg-muted" : ""}
                          >
                            Newest
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setSortOption("alphabetical")}
                            className={sortOption === "alphabetical" ? "bg-muted" : ""}
                          >
                            Alphabetical
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setSortOption("relevance")}
                            className={sortOption === "relevance" ? "bg-muted" : ""}
                          >
                            Relevance
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      {/* View toggle buttons */}
                      <div className="flex">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setViewMode("grid")}
                          className={viewMode === "grid" ? "bg-muted" : ""}
                        >
                          <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-1.5 h-1.5 rounded-sm bg-current"></div>
                            <div className="w-1.5 h-1.5 rounded-sm bg-current"></div>
                            <div className="w-1.5 h-1.5 rounded-sm bg-current"></div>
                            <div className="w-1.5 h-1.5 rounded-sm bg-current"></div>
                          </div>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setViewMode("list")}
                          className={viewMode === "list" ? "bg-muted" : ""}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Selected filters badges - improved styling */}
                {(selectedInstitutions.length > 0 || selectedTags.length > 0) && (
                  <div className="flex flex-wrap gap-1 items-center mt-1 p-2 bg-muted/30 rounded-md">
                    <span className="text-xs text-muted-foreground mr-1">Active filters:</span>
                    {selectedInstitutions.map(institution => (
                      <Badge key={institution} variant="secondary" className="gap-1 px-2 py-1">
                        {institution}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => toggleInstitution(institution)}
                        />
                      </Badge>
                    ))}
                    {selectedTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1 px-2 py-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => toggleTag(tag)}
                        />
                      </Badge>
                    ))}
                    {(selectedInstitutions.length > 0 || selectedTags.length > 0) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs ml-auto"
                        onClick={() => {
                          setSelectedInstitutions([]);
                          setSelectedTags([]);
                        }}
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Advanced filters collapsible section */}
                <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                  <CollapsibleContent className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/50">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Date Range</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Input type="date" placeholder="From" className="text-xs" />
                          <Input type="date" placeholder="To" className="text-xs" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Data Quality</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="quality-high" />
                            <label htmlFor="quality-high" className="text-sm">High</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="quality-medium" />
                            <label htmlFor="quality-medium" className="text-sm">Medium</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="quality-low" />
                            <label htmlFor="quality-low" className="text-sm">Low</label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Region</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="region-na" />
                            <label htmlFor="region-na" className="text-sm">North America</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="region-eu" />
                            <label htmlFor="region-eu" className="text-sm">Europe</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="region-as" />
                            <label htmlFor="region-as" className="text-sm">Asia</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              {/* Content area */}
              <div className="overflow-auto flex-1 pr-2">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No results found</h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your search or filter to find what you're looking for
                    </p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <Card 
                        key={item.id} 
                        className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
                      >
                        <div className="aspect-video bg-muted relative">
                          {item.previews.length > 0 ? (
                            <img 
                              src={item.previews[0]} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No preview
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex space-x-1">
                            {item.contents.map((content, index) => (
                              <div key={index} className="bg-background/80 backdrop-blur-sm p-1 rounded">
                                {renderContentIcon(content)}
                              </div>
                            ))}
                          </div>
                        </div>
                        <CardHeader className="p-3">
                          <CardTitle className="text-base">{item.title}</CardTitle>
                          <CardDescription className="text-xs">{item.institution}</CardDescription>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.slice(0, 2).map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {item.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardFooter className="p-3 pt-0 justify-between">
                          <Button size="sm" variant="outline" onClick={() => handleSelectItem(item)}>
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="default" 
                            onClick={handleAddStratum} 
                            disabled={strata.length >= 4}
                          >
                            Add
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center border rounded-lg p-3 hover:border-primary transition-colors"
                      >
                        <div className="h-16 w-24 bg-muted rounded overflow-hidden flex-shrink-0">
                          {item.previews.length > 0 ? (
                            <img 
                              src={item.previews[0]} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No preview
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.institution}</p>
                          <div className="flex mt-1 flex-wrap gap-1">
                            {item.contents.map((content, index) => (
                              <Badge key={index} variant="outline" className="flex items-center text-xs">
                                {renderContentIcon(content)}
                                <span className="ml-1 capitalize">{content}</span>
                              </Badge>
                            ))}
                            {item.tags.slice(0, 2).map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <Button size="sm" variant="outline" onClick={() => handleSelectItem(item)}>
                            Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="default" 
                            onClick={handleAddStratum}
                            disabled={strata.length >= 4}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StratumCatalog;
