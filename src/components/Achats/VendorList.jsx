import { useState } from "react";
import { Search } from "lucide-react";

const VendorList = ({ vendors, onSelectVendor }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredVendors = vendors.filter(vendor =>
        vendor.user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-purple-800">Liste des Vendeurs</h1>
            <div className="flex items-center mb-4 self-end relative w-1/3">
                <input
                    type="text"
                    placeholder="Rechercher par nom, prenom, email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-2 px-5 pl-8 border rounded text-purple-600 placeholder:text-purple-600"
                    />
                <Search className="absolute left-2 top-3 text-purple-400" size={20} />
            </div>
            <div className="flex flex-col space-y-5">
                {filteredVendors.map(vendor => (
                <div
                    key={vendor.id} 
                    className="bg-gradient-to-br from-violet-400 to-purple-500 px-3 py-1 w-4/5 h-16 mx-auto flex justify-between rounded shadow cursor-pointer hover:bg-purple-600"
                    onClick={() => onSelectVendor(vendor)}
                >
                    <div className="ml-3 sm:mb-0 flex justify-center items-center space-x-3">
                        <img
                            src={vendor.user.photo}
                            alt={`Photo de profil de ${vendor.user.firstname} ${vendor.user.lastname}`}
                            className="w-12 h-12 rounded-full object-cover mx-auto sm:mx-0"
                        />
                        <h2 className="text-xl font-semibold text-white">{vendor.user.firstname} {vendor.user.lastname}
                            <p className="text-violet-900 font-normal text-[12px]">{vendor.user.email}</p>
                        </h2>
                    </div>
                    <div className='flex flex-col justify-center items-end mr-3'>
                    <p className="text-purple-100 text-sm"> {vendor.produits.length} Produits</p>
                    </div>
                    
                </div>
                ))}
            </div>
        </div>
    );
};

export default VendorList;