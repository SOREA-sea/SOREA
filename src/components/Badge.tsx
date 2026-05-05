import type { NextPage } from "next";
import { type CSSProperties } from "react";
import Image from "next/image";

export type BadgeType = {
    className?: string;
    spotPoints: string;
    /** Variant props */
    badge?: boolean;
};

const Badge: NextPage<BadgeType> = ({
    className = "",
    badge = true,
    spotPoints,
}) => {
    if (!spotPoints) return null;

    return (
        <div className={`w-10 h-10 relative ${className}`}>
            <Image
                className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50%] max-w-full overflow-hidden max-h-full object-cover"
                width={40}
                height={40}
                sizes="100vw"
                alt=""
                src={spotPoints}
            />
            <div className="absolute w-[37.5%] top-[25px] right-[0%] left-[62.5%] rounded-[50%] bg-[#dadadd] h-[15px]" />
            <Image
                className="absolute w-[37.5%] top-[25px] right-[0%] left-[62.5%] max-w-full overflow-hidden h-[15px]"
                width={15}
                height={15}
                sizes="100vw"
                alt=""
                src="/Frame.svg"
            />
        </div>
    );
};

export default Badge;