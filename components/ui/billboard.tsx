import { Billboard as BillboardTypes } from "@/types";

interface BillboardProps {
    data: BillboardTypes;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
    return (
        <div className="p-4 overflow-hidden sm:p-6 lg:p-8 rounded-xl">
            <div
                style={{ backgroundImage: `url(${data?.imageUrl})` }}
                className="rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover bg-center"
            >
                {/* readability overlay */}
                <div className="absolute inset-0 bg-black/45" />
                {/* optional: adds a little “focus” behind text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

                <div className="relative flex flex-col items-center justify-center w-full h-full px-4 text-center gap-y-8">
                    <div className="max-w-xs text-3xl font-bold sm:text-5xl lg:text-6xl sm:max-w-xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                        {data?.label}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billboard;
