export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Break out of the parent max-w-3xl constraint
  // Use full viewport width and center with max-w-7xl
  return (
    <div
      className="w-screen relative left-1/2 right-1/2 -mx-[50vw]"
      style={{ maxWidth: '100vw' }}
    >
      <div className="max-w-7xl mx-auto px-4">{children}</div>
    </div>
  );
}
