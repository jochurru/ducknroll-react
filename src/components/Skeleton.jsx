export const ProductCardSkeleton = () => (
<div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
{/* Imagen skeleton */}
<div className="h-48 bg-gray-300"></div>

{/* Contenido skeleton */}
<div className="p-4">
    {/* Título */}
    <div className="h-5 bg-gray-300 rounded mb-3 w-3/4"></div>
    
    {/* Descripción */}
    <div className="h-3 bg-gray-200 rounded mb-2"></div>
    <div className="h-3 bg-gray-200 rounded mb-4 w-5/6"></div>
    
    {/* Precio y botón */}
    <div className="flex justify-between items-center mt-4">
    <div className="h-6 bg-gray-300 rounded w-20"></div>
    <div className="h-9 bg-gray-300 rounded w-24"></div>
    </div>
</div>
</div>
);

export const ProductDetailSkeleton = () => (
<div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
    {/* Imagen */}
    <div className="h-96 bg-gray-300 rounded-lg"></div>
    
    {/* Info */}
    <div className="flex flex-col space-y-4">
    <div className="h-8 bg-gray-300 rounded w-3/4"></div>
    <div className="h-10 bg-gray-300 rounded w-32"></div>
    <div className="h-20 bg-gray-200 rounded"></div>
    <div className="h-12 bg-gray-300 rounded"></div>
    <div className="h-12 bg-gray-300 rounded"></div>
    </div>
</div>
</div>
);