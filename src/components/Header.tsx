import { FileText, Activity } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Activity className="h-8 w-8" />
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Restore Radar</h1>
              <p className="text-sm text-muted-foreground">Análise Inteligente de Logs de Backup</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;