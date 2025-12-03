// Desktop Logo (Arrow-shaped like in the original design)
export const Logo = ({ className = "" }) => {
  return (
    <div
      className={`${className}`}
      
    >
      <img src="/Tilboð-is-merki-Yellow.svg" alt="Tilboð.is" className="w-[13.25rem] h-[2.75rem] object-contain" />
    </div>
  );
};

// Mobile Logo (Arrow-shaped like in the original design)
export const MobileLogo = ({ className = "" }) => {
  return (
    <div
      className={` ${className}`}
     
    >
      <img src="/Tilboð-is-merki-Yellow.svg" alt="Tilboð.is" className="w-[10.125rem] h-[3.50rem] object-contain" />
    </div>
  );
};

