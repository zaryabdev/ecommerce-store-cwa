import NextImage from "next/image";

import { cn } from "@/lib/utils";
import { Billboard as BillboardTypes } from "@/types";

interface BillboardProps {
    data: BillboardTypes;
    /**
     * Priority-load the hero image. Defaults to false so existing call
     * sites (e.g. the category page's own billboard) keep their previous,
     * non-priority behavior. The homepage passes `priority` explicitly,
     * since its billboard is the genuine LCP candidate there.
     */
    priority?: boolean;
    /**
     * Aspect-ratio classes for the image box. Defaults to the exact ratio
     * this component has always used (square on mobile, 2.4:1 from `md`
     * up), so existing call sites render unchanged unless they explicitly
     * opt into a different ratio.
     */
    aspectClassName?: string;
}

const Billboard: React.FC<BillboardProps> = ({
    data,
    priority = false,
    aspectClassName = "aspect-square md:aspect-[2.4/1]",
}) => {
    const hasImage = Boolean(data?.imageUrl);
    const hasLabel = Boolean(data?.label);

    // Graceful fallback: nothing to show at all (no image, no label) —
    // render nothing rather than a broken/empty box.
    if (!hasImage && !hasLabel) {
        return null;
    }

    return (
        <div className="p-4 overflow-hidden sm:p-6 lg:p-8 rounded-xl">
            <div className={cn("relative overflow-hidden rounded-xl", aspectClassName)}>
                {hasImage ? (
                    <>
                        <NextImage
                            src={data.imageUrl}
                            alt={hasLabel ? data.label : ""}
                            fill
                            priority={priority}
                            sizes="100vw"
                            className="object-cover object-center"
                        />
                        {/* readability overlay */}
                        <div className="absolute inset-0 bg-foreground/45" />
                        {/* optional: adds a little "focus" behind text */}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-foreground/10 to-transparent" />
                    </>
                ) : (
                    // No image, only a label: fall back to a plain token
                    // surface instead of a broken/missing background image.
                    <div className="absolute inset-0 bg-surface-muted" />
                )}

                {hasLabel && (
                    <div className="relative flex flex-col items-center justify-center w-full h-full px-4 text-center gap-y-8">
                        <div
                            className={cn(
                                "max-w-xs text-3xl font-bold sm:text-5xl lg:text-6xl sm:max-w-xl",
                                hasImage
                                    ? "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                                    : "text-foreground",
                            )}
                        >
                            {data.label}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Billboard;
