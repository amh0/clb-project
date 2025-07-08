const Logo = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 relative">
                <div className="absolute inset-0 rounded-full border-4 border-primary"></div>
                <div className="absolute inset-2 rounded-full border-4 border-primary"></div>
                <div className="absolute w-3 h-3 bg-red-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute w-2 h-2 bg-primary rounded-full top-1/4 left-1/4"></div>
                <div className="absolute w-2 h-2 bg-primary rounded-full bottom-1/4 right-1/4"></div>
                <div className="absolute w-2 h-2 bg-primary rounded-full top-1/4 right-1/4"></div>
            </div>
            <h1 className="text-2xl font-bold mt-4">Ciencia Link</h1>
        </div>
    );
};

export default Logo;
