
import { useState } from "react";
import StratumLayout from "@/components/StratumLayout";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import AppSidebar from "@/components/AppSidebar";
import { StratumProvider } from "@/contexts/StratumContext";

const Index = () => {
  const [appSidebarOpen, setAppSidebarOpen] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);

  return (
    <StratumProvider>
      <div className="h-screen w-full flex flex-col bg-background">
        <TopBar 
          onToggleSidebar={() => setAppSidebarOpen(!appSidebarOpen)} 
          onToggleAIAssistant={() => setAiSidebarOpen(!aiSidebarOpen)}
        />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-hidden">
            <StratumLayout />
          </main>
          <Sidebar isOpen={aiSidebarOpen} onClose={() => setAiSidebarOpen(false)} />
        </div>
        <AppSidebar isOpen={appSidebarOpen} onClose={() => setAppSidebarOpen(false)} />
      </div>
    </StratumProvider>
  );
};

export default Index;
