import Dashboard from "@/components/Dashboard";
import { fanConfig } from "@/lib/fanConfig";

export default function Home() {
  return <Dashboard config={fanConfig} />;
}
