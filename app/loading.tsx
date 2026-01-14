export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Skeleton */}
            <div className="h-20 border-b border-gray-100 flex items-center justify-between px-8">
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="w-32 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Hero Skeleton */}
            <div className="py-32 px-8 container mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="h-16 w-3/4 bg-gray-200 rounded-2xl animate-pulse"></div>
                        <div className="h-6 w-1/2 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-14 w-40 bg-gray-200 rounded-full animate-pulse mt-8"></div>
                    </div>
                    <div className="aspect-[4/3] bg-gray-200 rounded-3xl animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
