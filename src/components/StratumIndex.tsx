
import { Stratum } from "@/contexts/StratumContext";
import { Progress } from "@/components/ui/progress";

type StratumIndexProps = {
  stratum: Stratum;
};

const StratumIndex = ({ stratum }: StratumIndexProps) => {
  const { value, description, components } = stratum.tabs.index;
  
  // Calculate total weight to ensure it adds up to 100%
  const totalWeight = components.reduce((acc, comp) => acc + comp.weight, 0);
  
  // Get index color based on value
  const getIndexColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-blue-500"; 
    if (value >= 40) return "bg-yellow-500";
    if (value >= 20) return "bg-orange-500";
    return "bg-red-500";
  };
  
  return (
    <div className="h-full p-6 bg-background flex flex-col">
      <div className="text-center mb-8">
        <div className="mb-2 text-sm font-medium text-muted-foreground">Composite Index</div>
        <div className="relative inline-block">
          <svg viewBox="0 0 100 100" className="w-32 h-32">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={value >= 80 ? "#4CAF50" : value >= 60 ? "#2196F3" : value >= 40 ? "#FFC107" : value >= 20 ? "#FF9800" : "#F44336"}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40 * (value / 100)} ${2 * Math.PI * 40 * (1 - value / 100)}`}
              strokeDashoffset={2 * Math.PI * 10}
              transform="rotate(-90 50 50)"
            />
            
            {/* Value text */}
            <text
              x="50"
              y="55"
              textAnchor="middle"
              fontSize="20"
              fontWeight="bold"
              fill="currentColor"
            >
              {value}
            </text>
          </svg>
        </div>
        <div className="mt-4 text-sm max-w-md mx-auto">{description}</div>
      </div>
      
      <div className="space-y-6 flex-1">
        <h3 className="text-sm font-medium">Component Breakdown</h3>
        
        <div className="space-y-4">
          {components.map((component, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">{component.name}</div>
                <div className="text-sm font-medium">
                  {component.value} 
                  <span className="text-muted-foreground ml-1">
                    ({Math.round(component.weight * 100 / totalWeight)}%)
                  </span>
                </div>
              </div>
              <Progress value={component.value} className={getIndexColor(component.value)} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-md text-sm">
        <h4 className="font-medium mb-2">Index Insights</h4>
        <p>
          This composite index is calculated based on weighted components shown above.
          The current value indicates {value >= 80 ? "excellent" : value >= 60 ? "good" : value >= 40 ? "average" : value >= 20 ? "below average" : "poor"} performance.
        </p>
      </div>
    </div>
  );
};

export default StratumIndex;
