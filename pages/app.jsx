import DataSection from "../components/DataSection.jsx";
import ControlSection from "../components/ControlSection.jsx";
import CollateralSection from "../components/CollateralSection.jsx";
import PositionSection from "../components/PositionSection.jsx";

export default function App() {
  return (
    <div className="flex w-full min-h-screen font-sans bg-primaryBg">
      <main className="flex flex-col flex-1 gap-6 p-8">
        <header>
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        </header>
        <hr className="border-secondary" />
        <DataSection />
        <CollateralSection />
      </main>
      <aside className="flex flex-col gap-y-6 pt-6 pr-6 w-96">
        <ControlSection />
        <PositionSection />
      </aside>
    </div>
  );
}
