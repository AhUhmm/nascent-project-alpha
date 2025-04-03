
import { useStratum } from "@/contexts/StratumContext";
import StratumPanel from "./StratumPanel";

const StratumLayout = () => {
  const { strata, viewMode, activeStratumId } = useStratum();

  // Filter strata based on view mode
  const visibleStrata = viewMode === "single" 
    ? strata.filter(s => s.id === activeStratumId)
    : strata;

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
