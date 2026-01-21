export const PageTitle = ({ title }: { title: string }) => {
  return (
    <h1 className="text-xl sm:text-2xl font-light text-foreground mb-4 sm:mb-6">
      {title}
    </h1>
  );
};
