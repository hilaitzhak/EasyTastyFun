function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-full animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-5 flex flex-col flex-grow gap-3">
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-4 bg-gray-200 rounded-full w-1/2" />
        <div className="mt-auto flex gap-4 pt-3 border-t border-gray-100">
          <div className="h-3 bg-gray-200 rounded-full w-16" />
          <div className="h-3 bg-gray-200 rounded-full w-12" />
        </div>
      </div>
    </div>
  );
}

export default RecipeCardSkeleton;
