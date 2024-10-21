import { useState } from 'react';
import { Search } from "lucide-react";

const ClientList = ({ commandes, onSelectCommande }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredCommandes = commandes.filter(commande =>
        commande.user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commande.user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commande.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="container mx-auto p-6 flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-purple-800">Liste des Commandes</h1>
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
                {filteredCommandes.map(commande => (
                <div
                    key={commande.id} 
                    className="bg-gradient-to-br from-violet-400 to-purple-500 px-3 py-1 w-4/5 h-16 mx-auto flex justify-between rounded shadow cursor-pointer hover:bg-purple-900"
                    onClick={() => onSelectCommande(commande)}
                >
                    <div className="ml-3 sm:mb-0 flex justify-center items-center space-x-3">
                        <img
                            src={commande.user.photo}
                            alt={`Photo de profil de ${commande.user.firstname} ${commande.user.lastname}`}
                            className="w-12 h-12 rounded-full object-cover mx-auto sm:mx-0"
                        />
                        <h2 className="text-lg font-semibold text-white">{commande.user.firstname} {commande.user.lastname}</h2>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        <p className="text-white">{commande.user.email}</p>
                        <p className='text-purple-100 text-sm'> {commande.produits.length} Produits commandés</p>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
};

export default ClientList;