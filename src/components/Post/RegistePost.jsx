import React, { useState } from 'react';
import { X, ImagePlus, Tag, Sparkles, Plus, Maximize } from 'lucide-react';
import useCrud from "../../hooks/useCrudAxios";
import AlertService from "../../services/notifications/AlertService";
import { useActor } from "../../context/ActorContext";
import FlexibleLoadingSpinner from "./Load";

const SIZE = {
    XS: 'XS',
    S: 'S',
    M: 'M',
    L: 'L',
    XL: 'XL'
};
const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

export default function AddPostModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const { create: createPost } = useCrud('posts');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        category: '',
        size: SIZE.M,
    });
    const { actor, setActor } = useActor();
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setImage(files[0]);
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.tags || !formData.category || !formData.size || !image) {
            AlertService.error('Tous les champs sont obligatoires');
            return;
        }
        if (actor.credits < 10) {
            await AlertService.error('Votre crédit est insuffisant');
            return;
        }
        setIsLoading(true);
        try {
            const formPayload = new FormData();
            Object.keys(formData).forEach(key => formPayload.append(key, formData[key]));
            formPayload.append('photo', image);

            const data = await createPost(formPayload);
            setActor({ ...actor, credits: actor.credits - 10, posts: [...actor.posts, data] });
            AlertService.success('Post créé avec succès');
            setIsOpen(false);
            resetForm();
        } catch (error) {
            AlertService.error('Erreur lors de la création du post');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            tags: '',
            category: '',
            size: SIZE.M,
        });
        setImage(null);
        setImagePreview(null);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex flex-col items-center gap-0.5 hover:text-red-500"
            >
                <Plus className="w-6 h-6" />
                Créer
            </button>
        );
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-5xl flex">
                {/* Image section */}
                <div className="w-1/3 p-6 flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <input
                            type="file"
                            id="image"
                            onChange={handleInputChange}
                            className="hidden"
                            accept="image/*"
                            name="image"
                        />
                        <div
                            className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden"
                            onClick={() => !imagePreview && document.getElementById('image').click()}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center">
                                    <ImagePlus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-500">
                                        Ajouter une image
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Glissez une image ou cliquez pour en sélectionner une
                                    </p>
                                </div>
                            )}
                        </div>
                        {imagePreview && (
                            <button
                                onClick={() => {
                                    setImage(null);
                                    setImagePreview(null);
                                }}
                                className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300 shadow-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Form section */}
                <div className="w-2/3 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Créer une publication
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                Titre
                            </label>
                            <input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="mt-2 w-full border-2 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 dark:bg-gray-800"
                                placeholder="Un titre captivant..."
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="mt-2 h-24 w-full border-2 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 dark:bg-gray-800"
                                placeholder="Partagez votre histoire..."
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label htmlFor="category" className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-blue-500" />
                                    Catégorie
                                </label>
                                <input
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="mt-2 w-full border-2 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 dark:bg-gray-800"
                                    placeholder="Ex: Technologie, Lifestyle..."
                                    required
                                />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="size" className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Maximize className="w-5 h-5 text-blue-500" />
                                    Taille
                                </label>
                                <select
                                    id="size"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                    className="mt-2 w-full border-2 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 dark:bg-gray-800"
                                    required
                                >
                                    {Object.entries(SIZE).map(([key, value]) => (
                                        <option key={key} value={value}>{value}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="tags" className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Tag className="w-5 h-5 text-blue-500" />
                                Tags
                            </label>
                            <input
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                className="mt-2 w-full border-2 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 dark:bg-gray-800"
                                placeholder="design, inspiration, créativité..."
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    resetForm();
                                }}
                                className="px-6 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Publication en cours...' : 'Publier'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}