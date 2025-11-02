import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyOffer {
    id: number;
    offerType: string;
    title: string;
    discount: string;
    description: string;
    image: string;
    badge: string;
    location: string;
    time: string;
    availableDays: string[];
    link: string;
}

interface WeeklyOfferCardProps {
    offer: WeeklyOffer;
    className?: string;
}

export default function WeeklyOfferCard({ offer, className }: WeeklyOfferCardProps) {
    const { title, discount, description, image, badge, location, time, availableDays } = offer;
    const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <div className="theme-pink">
            <div className={cn(
                "w-full min-h-[34rem] h-[34rem] sm:h-[33rem] md:h-[38.75rem] relative overflow-hidden border border-primary rounded-[2.5rem] bg-card-background mx-auto",
                className
            )}>
                {/* Discount Banner */}
                <div className="absolute left-[1rem] right-[1rem] top-[1rem] z-30 flex select-none items-center justify-center rounded-full py-[0.375rem] h-[2.5rem] md:h-[3.5rem] w-auto bg-pink">
                    <span className="text-xl md:text-[1.75rem] font-semibold text-dark max-w-[90%] w-full text-center truncate">
                        {discount}
                    </span>
                </div>

                {/* Main Image */}
                <div className="relative h-[12.5rem] w-full bg-card-background sm:h-[15rem] border-b border-primary">
                    <img
                        src={image}
                        alt={title}
                        className="pointer-events-none relative z-10 select-none object-cover w-full h-full"
                    />
                    {/* Badge Indicator */}
                    <div className="min-w-[14.75rem] text-center absolute bottom-0 left-1/2 z-40 -translate-x-1/2 transform">
                        <div className="max-w-[14.5rem] min-w-[9rem] rounded-t-3xl text-sm shadow-lg px-[2rem] py-[0.34375rem] font-semibold lg:text-base border border-b-0 bg-card-background text-smoky-white border-primary w-full truncate">
                            {badge}
                        </div>
                    </div>
                </div>

                {/* Bottom Content Overlay */}
                <div className="z-30 p-[1rem] md:p-[1.5rem] flex flex-col justify-between sm:rounded-b-3xl bg-card-background">
                    {/* Content Section */}
                    <div className="pointer-events-none flex-1">
                        <div className=" border-b border-primary">
                            {/* Title */}
                            <h3 className="max-w-[90%] text-lg font-bold lg:text-2xl text-smoky-white mb-2 lg:mb-4 w-full truncate">
                                {title}
                            </h3>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 py-2 md:py-4 text-sm font-semibold sm:text-base text-yellow max-w-[90%] w-full truncate">
                            <MapPin />  {location}
                        </div>

                        {/* Description */}
                        <p className="h-[9.99rem] w-full text-sm md:text-base text-smoky-white font-medium">
                            {description}
                        </p>

                    </div>
                    <div className='absolute bottom-[3.50rem] md:bottom-[4rem] left-[1.5rem] right-[1.5rem] text-yellow text-lg md:text-2xl font-medium'>
                        {time}
                    </div>
                    {/* Action Buttons */}
                    <div className="absolute bottom-[1.5rem] left-[1.5rem] right-[1.5rem] flex flex-col gap-2">
                        {/* Available Days */}
                        <div className="grid grid-cols-7 gap-2 text-xs sm:text-sm lg:text-base font-semibold">
                            {allDays.map((day) => (
                                <div
                                    key={day}
                                    className={`flex items-center justify-center min-h-[1.4375rem] min-w-[2.018rem] py-1 rounded-sm ${availableDays.includes(day) ? 'bg-primary text-dark' : 'bg-card-background border border-primary text-smoky-white'
                                        }`}
                                >
                                    <p>{day}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
