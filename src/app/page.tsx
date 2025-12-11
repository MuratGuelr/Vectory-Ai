import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import VectorizeComponent from '@/components/VectorizeComponent';

export default function Home() {
  return (
    <div className="flex bg-background-light dark:bg-background-dark text-[#111812] dark:text-white font-display overflow-hidden h-screen w-full">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light dark:bg-background-dark">
        <DashboardHeader />
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto w-full flex flex-col items-center justify-center relative">
             <div className="w-full h-full">
                 <VectorizeComponent />
             </div>
        </div>
      </main>
    </div>
  );
}
