import { Header } from '@/shared/ui/header';

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="max-w-3xl mx-auto w-full">
        <Header />
      </div>
      <main className="flex-1 flex flex-col py-6 px-4 max-w-3xl mx-auto w-full">
        {children}
      </main>
    </>
  );
}
