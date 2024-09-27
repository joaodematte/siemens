import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';

export default async function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex min-h-screen w-full grow flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          asd
        </main>
      </div>
    </div>
  );
}
