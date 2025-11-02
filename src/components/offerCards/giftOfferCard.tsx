import AnimatedButton from "../ui/animatedButton";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface GiftOffer {
  id: number;
  offerType: string;
  title: string;
  price: string;
  description: string;
  image: string;
  category: string;
  timeLeft: string;
  purchaseCount: number;
  link: string;
}

interface GiftOfferCardProps {
  offer: GiftOffer;
  className?: string;
}

export default function GiftOfferCard({
  offer,
  className,
}: GiftOfferCardProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const {
    title,
    price,
    description,
    image,
    category,
    timeLeft,
    purchaseCount,
    id,
  } = offer;

  return (
    <div className="theme-orange">
      <div
        className={cn(
          "w-full h-[34rem] sm:h-[38rem] md:h-[42rem] relative overflow-hidden border border-primary rounded-[2.5rem] bg-card-background mx-auto flex flex-col",
          className
        )}
      >
        {/* Price Banner */}
        <div className="bg-primary absolute left-[1rem] right-[1rem] top-[1rem] z-30 flex select-none items-center justify-center rounded-full py-[0.375rem] h-[2.5rem] md:h-[3.5rem] w-auto bg-offer-banner">
          <span className="text-xl md:text-[1.75rem] font-semibold text-dark max-w-[80%] w-full text-center truncate">
            {"/gift-certificates" !== pathname ? price : category}
          </span>
        </div>

        {/* Main Image */}
        <div className="relative h-[10rem] sm:h-[12rem] md:h-[14rem] w-full bg-card-background border-b border-primary flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="pointer-events-none relative z-10 select-none object-cover w-full h-full"
          />
          {/* Time Left Indicator */}
          <div className="min-w-[9rem] text-center absolute bottom-0 left-1/2 z-40 -translate-x-1/2 transform">
            <div className="max-w-[14.5rem] min-w-[9rem] rounded-t-3xl text-sm shadow-lg px-[2rem] py-[0.34375rem] font-semibold lg:text-base border border-b-0 bg-card-background text-smoky-white border-primary w-full truncate">
              {timeLeft}
            </div>
          </div>
        </div>

        {/* Bottom Content Overlay */}
        <div className="z-30 p-[1rem] md:p-[1.5rem] flex flex-col justify-between sm:rounded-b-3xl bg-card-background">
          {/* Content Section */}
          <div className="pointer-events-none flex-1">
            <div className="border-b border-primary">
              {/* Category */}
              <div className="text-xs sm:text-sm lg:text-base font-semibold text-yellow">
                {"/gift-certificates" !== pathname
                  ? category
                  : purchaseCount + " have taken advantage of the offer"}{" "}
              </div>

              {/* Title */}
              <h3 className="max-w-[90%] text-lg font-bold lg:text-xl 2xl:text-2xl text-smoky-white mb-2 lg:mb-4 w-full truncate">
                {title}
              </h3>
            </div>

            {/* Description */}
            <p className="h-[9.99rem] w-full text-sm md:text-base text-smoky-white pt-4 font-medium overflow-hidden">
              <span className="block line-clamp-6 sm:line-clamp-7 md:line-clamp-8">
                {description}
              </span>
            </p>
          </div>

          {/* Purchase Count - Absolute positioned */}
          <div className="absolute bottom-[4.75rem] md:bottom-[6rem] text-smoky-white text-sm md:text-base font-medium">
            {pathname !== "/gift-certificates" ? (
              <p className="max-w-[100%] md:max-w-[80%] lg:max-w-[100%] w-full truncate">
                {purchaseCount} have taken{" "}
                <span className="hidden md:inline">advantage of the offer</span>
              </p>
            ) : (
              <p className="text-yellow text-lg md:text-xl lg:text-3xl font-bold">
                {price}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-[1rem] left-[1rem] right-[1rem] 2xl:bottom-[1.5rem] lg:left-[1.5rem] lg:right-[1.5rem] flex flex-col gap-2">
            {/* View Offer Button */}
            <AnimatedButton link={`/gift-details/${id}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
