import React, { useState } from 'react';
import { Camera, Plus, X } from 'lucide-react';

export default function PostCreation() {
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <div>
            {/* Bouton pour créer un nouveau post */}
            <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white
    rounded-xl px-4 py-2 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
                <Plus className="w-4 h-4"/>
                <span>Créer un post</span>
            </button>


            {/* Modal de création de post */}
            {showCreateModal && (
                <CreateModal onClose={() => setShowCreateModal(false)}/>
            )}
        </div>
    );
}

function CreateModal({onClose}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Nouvelle Création</h2>
                    <button onClick={onClose}>
                        <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                    </button>
                </div>

                <div className="aspect-video bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                    <div className="text-center">
                        <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Glissez vos photos ou cliquez pour uploader</p>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Annuler
                    </button>
                    <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800">
                        Créer
                    </button>
                </div>
            </div>
        </div>
    );
}
