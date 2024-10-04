interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <img src="/topsun.png" alt="logo" width={180} height={51.42} />
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow">
        {children}
      </div>
    </div>
  );
}
