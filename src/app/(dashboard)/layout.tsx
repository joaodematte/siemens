import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex min-h-screen w-full grow flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
