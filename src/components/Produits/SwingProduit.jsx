import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark, DollarSign, Box } from 'lucide-react';
import {getTimeDifference} from "../../utils/tokenUtils";

const SwingProduit = ({ produit }) => {
console.log(produit)
    const {
        libelle,
        description,
        image,
        price,
        qte,
        createdAt,
        vendor,
        notes,
        commandes
    } = produit;

    const timeAgo = new Date(createdAt).toLocaleDateString();
    console.log(vendor)

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-0.5">
                        <div className="h-full w-full rounded-full relative overflow-hidden bg-white">
                            <img src={vendor.user.photo} alt="Profile" className="rounded-full" />
                        </div>
                    </div>
                    <div className="ml-4">
                        <h3 className="font-medium">{`${vendor.user.firstname} ${vendor.user.lastname}`}</h3>
                        <p className="text-gray-500 text-sm">{getTimeDifference(createdAt)}</p>
                    </div>
                </div>
                <h2 className="mt-4 text-xl font-semibold">{libelle}</h2>
                <p className="mt-2">{description}</p>
                <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-500 mr-1" />
                        <span className="font-bold">{price}</span>
                    </div>
                    <div className="flex items-center">
                        <Box className="h-5 w-5 text-blue-500 mr-1" />
                        <span>Quantité: {qte}</span>
                    </div>
                </div>
            </div>

            <div className="media-container">
                <img src={image} alt={libelle} className="w-full h-64 object-cover" />
            </div>

            <div className="p-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <Heart className="h-5 w-5" />

                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <MessageCircle className="h-5 w-5" />

                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <Share2 className="h-5 w-5" />
                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <Bookmark className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SwingProduit;