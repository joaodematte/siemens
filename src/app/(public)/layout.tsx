import Image from 'next/image';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Image
        src="/topsun.png"
        alt="logo"
        width={180}
        height={180}
        className="invert dark:invert-0"
      />
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow">
        {children}
      </div>
    </div>
  );
}
