
const FilterButtons = ({ activeFilter, setActiveFilter }) => (
    <div className="flex space-x-4">
        {['Tous','Tendances','recent','Posts','Produits', 'Events'].map((filter) => (
            <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter.toLowerCase()
                        ? 'bg-gradient-to-r from-rose-400 to-purple-400 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveFilter(filter.toLowerCase())}
            >
                {filter}
            </button>
        ))}
    </div>
);

export default FilterButtons;
