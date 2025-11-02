import { cn } from "@/lib/utils";
import AnimatedButton from "../ui/animatedButton";

interface Offer {
  id: number;
  offerType: string;
  title: string;
  discount: string;
  description: string;
  image: string;
  category: string;
  timeLeft: string;
  location: string;
  price: string | null;
  discountPrice: string | null;
  link: string;
}

interface ActiveOfferCardProps {
  offer: Offer;
  className?: string;
}

export default function ActiveOfferCard({
  offer,
  className,
}: ActiveOfferCardProps) {
  const {
    title,
    discount,
    description,
    image,
    category,
    timeLeft,
    link,
    price,
    discountPrice,
  } = offer;
  return (
    <div
      className={cn(
        "w-full min-h-[34rem] h-[34rem] sm:h-[34rem] md:h-[38.75rem] relative overflow-hidden rounded-[2.5rem] border border-primary sm:rounded-[2.5rem] bg-card-background mx-auto",
        className
      )}
    >
      {/* Discount Banner */}
      <div className="bg-primary absolute left-[1rem] right-[1rem] top-[1rem] z-30 flex select-none items-center justify-center rounded-full py-[0.375rem] h-[3rem] md:h-[3.5rem] w-auto bg-offer-banner">
        <span className="text-xl md:text-[1.75rem] font-semibold text-dark max-w-[90%] w-full text-center truncate">
          {discount}
        </span>
      </div>

      {/* Main Image */}
      <div className="relative w-full bg-card-background h-[12.5rem] sm:h-[15rem] lg:h-[17.5rem] border-b border-primary">
        <img
          src={image}
          alt={title}
          className="pointer-events-none relative z-10 select-none object-cover w-full h-full"
        />
        {/* Time Left Indicator */}
        <div className="absolute bottom-0 left-1/2 z-40 -translate-x-1/2 transform">
          <div className="min-w-[9.4375rem] max-w-[14.5rem] text-center rounded-t-3xl text-sm shadow-lg px-[2rem] py-[0.34375rem] font-semibold lg:text-base border border-b-0 bg-card-background text-smoky-white border-primary w-full truncate">
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Bottom Content Overlay */}
      <div className="z-30 p-[1rem] lg:p-[1.5rem] flex flex-col justify-between sm:rounded-b-3xl bg-card-background">
        {/* Content Section */}
        <div className="pointer-events-none flex-1">
          <div className=" border-b border-primary">
            {/* Category */}
            <div className="text-xs font-semibold sm:text-base text-primary">
              {category}
            </div>

            {/* Title */}
            <h3 className="max-w-[90%] text-sm font-bold sm:text-base lg:text-2xl text-smoky-white mb-4 w-full truncate">
              {title}
            </h3>
          </div>

          {/* Description */}
          <p className="h-[5.4375rem] w-[80%] text-base text-smoky-white pt-4 font-medium">
            {description}
          </p>
        </div>

        {price && discountPrice && (
          <div className="absolute bottom-[5rem] left-[1rem] right-[1rem] md:bottom-[6rem] md:left-[1.5rem] md:right-[1.5rem]">
            <div className="flex items-center gap-4 md:gap-10">
              <span className=" text-xl md:text-2xl font-semibold text-pink">
                {discountPrice}.
              </span>
              <span className="font-semibold text-yellow text-sm md:text-base">
                {" "}
                previously {price}.
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-[1rem] left-[1rem] right-[1rem] md:bottom-[1.5rem] md:left-[1.5rem] md:right-[1.5rem]">
          {/* View Offer Button */}
          <AnimatedButton link={link} />
        </div>
      </div>
    </div>
  );
}
