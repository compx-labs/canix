export default function Header() {
  return (
    <header className="mb-6 md:mb-8 flex items-center justify-between gap-4">
      <img 
        src="/logo-long.png" 
        alt="Canix - The Yield Hunter" 
        className="h-24 max-w-[50%] object-contain"
      />
      <img 
        src="/powered by.png" 
        alt="Powered by CompX" 
        className="h-8 sm:h-12 md:h-16 lg:h-20 max-w-[45%] object-contain"
      />
    </header>
  );
}

