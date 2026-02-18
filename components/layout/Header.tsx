import { Shield, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Agent Explorer</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs bg-slate-800 text-slate-300">
                ERC-8004
              </Badge>
              <Badge variant="outline" className="text-xs border-emerald-500/50 text-emerald-400">
                Trust & Reputation
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
            <span>Powered by</span>
            <span className="font-semibold text-blue-400">AgentTrust</span>
          </div>
          <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
            <Search className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
