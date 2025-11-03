import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AnimatedButton = ({ link }: { link: string }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className="group  whitespace-nowrap overflow-hidden  w-full py-[0.6875rem] px-[1.5rem] rounded-[3.5rem] bg-card-background border border-primary hover:border-green-500 transition-all duration-100 cursor-pointer text-primary relative"
    >
      <div className="flex items-center justify-between md:-translate-x-1/4 transition-all duration-400 group-hover:translate-x-0">
        <ArrowRight
          size={32}
          className="hidden md:block text-green"
        />
        <div className="">
          <span className="text-lg lg:text-2xl font-semibold">View offer</span>
        </div>
        <ArrowRight
          size={32}
          className="text-primary"
        />
      </div>
    </button>
  );
};

export default AnimatedButton;
