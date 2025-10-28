// Desktop Logo (Arrow-shaped like in the original design)
export const Logo = ({ className = "" }) => {
  return (
    <div
      className={`bg-primary inline-flex items-center justify-center pr-5 ${className}`}
      style={{
        height: "2.75rem",
        width: "9.25rem",
        clipPath:
          "polygon(0 0, calc(100% - 1.875rem) 0, 100% 50%, calc(100% - 1.875rem) 100%, 0 100%)",
      }}
    >
      <span className="text-dark font-extrabold whitespace-nowrap flex items-center justify-center w-full h-full text-center">
        Tilboð.is
      </span>
    </div>
  );
};

// Mobile Logo (Arrow-shaped like in the original design)
export const MobileLogo = ({ className = "" }) => {
  return (
    <div
      className={`bg-primary inline-flex items-center justify-center pr-4 ${className}`}
      style={{
        height: "2.50rem",
        width: "8.125rem",
        clipPath:
          "polygon(0 0, calc(100% - 1.25rem) 0, 100% 50%, calc(100% - 1.25rem) 100%, 0 100%)",
      }}
    >
      <span className="text-dark font-extrabold whitespace-nowrap flex items-center justify-center w-full h-full text-center text-sm">
        Tilboð.is
      </span>
    </div>
  );
};

