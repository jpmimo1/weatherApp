import { Sidebar } from "@/components";
import { LayoutContent } from "@/components/LayoutContent";
import { WeatherDesk } from "@/components/WeatherDesk";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-nowrap relative overflow-hidden">
      <LayoutContent sidebar={<Sidebar />} content={<WeatherDesk />} />
    </main>
  );
}
