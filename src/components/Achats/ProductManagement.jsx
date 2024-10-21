import React, { useState, useEffect } from 'react';
import useCrud from '../../hooks/useCrudAxios';
import { Search, Trash2, Plus, Minus, User, Mail, Phone, ArrowLeft, MessageSquare, CreditCard, ShoppingBag } from 'lucide-react';
import BoutiqueCard from './BoutiqueCard';
import { useAuth } from '../../context/AuthContext';

const ProductManagementPage = ({ vendor, onBack }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const commandeApi = useCrud('produits/commandes');
  const commandeProduitApi = useCrud('produits/commandes/produit');
  const { user } = useAuth();

  const addProduct = (product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      if (existingProduct.quantity < existingProduct.quantityMax) {
        setSelectedProducts(selectedProducts.map(p =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        ));
      }
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1, quantityMax: product.qte }]);
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

    const updateQuantity = (productId, change) => {
      setSelectedProducts(selectedProducts.map(p =>
        p.id === productId ? { ...p, quantity: Math.max(1, p.quantity + change)} : p
      ));
    };

    var filteredProducts = vendor.produits.filter(product =>
      product.libelle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const total = selectedProducts ? selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

    const checkout = async () => {
      try {
        if (selectedProducts.length === 0) {
          alert('Vous devez selectionner au moins un produit');
          throw new Error('Aucun produit sélectionné');
        }
    
        if (!user) {
          alert('Vous devez être connecté pour passer une commande');
          return;
        }
  
        const orderData = {
          idUser:  user.id,
          actorId: vendor.id,
          montant: 0
        };
    
        // Créer une nouvelle commande
        const order = await commandeApi.create(orderData);
    
        for (const product of selectedProducts) {
          const productData = {
            idProduit: product.id,
            idCommande: order.id,
            qte: product.quantity,
            price: product.price
          };
    
          // Ajouter un produit à la commande
          const result = await commandeProduitApi.create(productData);
    
          if (result) {
            console.log('Commande created successfully for product:', product.id);
          } else {
            console.error('Error creating commande for product:', product.id);
          }
        }
    
        setSelectedProducts([]);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const message = () => {
      alert(`Message to ${vendor.user.firstname} ${vendor.user.lastname}`);
    };

  // Filter products based on search term and selected category
  filteredProducts = vendor.produits.filter(product => {
    const matchesSearch = product.libelle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.libelle.startsWith(selectedCategory) : true;
    return matchesSearch && matchesCategory;
  });

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Get unique categories from products
  const filteredCategory = [...new Set(vendor.produits.map(product => {
    const firstWord = product.libelle.split(' ')[0];
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
  }))];

  return (
    <div className="bg-white flex flex-col h-screen">
      <button className="flex fixed bottom-1 right-3 ml-16 justify-center items-center bg-gradient-to-br from-violet-500 to-purple-500 text-white rounded-full rounded-bl_ p-3 animate-bounce" onClick={message}>
        <MessageSquare className="animate-pulse" size={24} />
      </button>
        {/* Partie droite avec les informations du vendeur et le tableau des produits */}
        <div className="flex-1 p-6 flex flex-col space-y-10">
          {/* Bouton de retour */}
          <button 
            onClick={onBack}
            className="flex items-center text-purple-600 hover:text-purple-800 mb-4"
            >
            <ArrowLeft className="mr-2" size={20} />
            Retour à la liste des vendeurs
          </button>

          {/* Cadre des informations du vendeur */}
          <BoutiqueCard user= {vendor} > </BoutiqueCard>
          {/* Sidebar avec la liste des produits */}
          <div className="w-[98%] self-end bg-white text-purple-600 p-4 overflow-x-auto">
            <div className="mb-4 flex justify-between items-center">
              <div className='text-purple-800 font-bold text-xl'>
                <h1>Bienvenue </h1>
              </div>
              <div className="relative w-1/3">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full p-2 pl-8 border rounded text-purple-600 placeholder:text-purple-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2 top-3 text-purple-400" size={20} />
              </div>
            </div>
            <div section="produits" className="w-full h-12 mb-5 p-5 mx-auto bg-gradient-to-br from-purple700 to[#2E1734] shadow shadow-violet-200 flex justify-start items-center space-x-5 rounded-lg">
              <button 
                className='h-7 bg-gradient-to-r from-rose-400 to-purple-400 shadow-inner shadow-violet-0 px-4 flex justify-center items-center rounded-xl'
                onClick={() => handleCategoryClick('')}
              >
                <h2 className='text-white font-semibold text-sm text-center'>Tous</h2>
              </button>
              {filteredCategory.map(category => (
                <button 
                  key={category}
                  className='h-7 bg-gradient-to-r from-rose-400 to-purple-400 shadow-inner shadow-violet-0 px-4 flex justify-center items-center rounded-xl'
                  onClick={() => handleCategoryClick(category)}
                >
                  <h2 className='text-white font-semibold text-sm text-center'>{category}</h2>
                </button>
              ))}
              <button className='h-7 bg-gradient-to-r from-rose-400 to-purple-400 shadow-inner shadow-violet-0 px-4 flex justify-center items-center rounded-xl'>
                <h2 className='text-white font-semibold text-sm text-center'>Commandes</h2>
              </button>
            </div>
            <div className="shadow shadow-violet-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-16 ">
              {filteredProducts.map(product => (
                product && product.qte >= 1 ? (
                  <>
                    <div
                      key={product.id} 
                      className="has-tooltip min-h-60 border-t-2 border-purple-50 pb-5 rounded-lg shadow-md shadow-purple-100 overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-purple-100 transition-shadow duration-300"
                      onClick={() => addProduct(product)}
                    >
                      <div className="p-4 flex flex-col justify-between space-y-3">
                        <div className="flex justify-center mb-1">
                          <img
                            src={product.image || "/api/placeholder/200/200"}
                            alt={product.libelle}
                            className="w-32 h-32 shadow-md shadow-purple-100 rounded-md object-cover mx-auto sm:mx-0"
                          />
                        </div>
                        <h3 className="text-lg font-medium text-purple-900 text-center">{product.libelle || 'Produit sans nom'}</h3>
                        <div className='flex justify-between'>
                          <span className="mt-1 text-md font-medium text-purple-900">
                            {typeof product.price === 'number' ? `${product.price} XOF` : 'Prix non disponible'}
                          </span>
                          <span className="mt-1 text-sm text-purple-500 flex font-semibold justify-center items-center">{product.qte}
                            <ShoppingBag />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='tooltip rounded shadow-lg p-1 h-40 flex flex-col justify-center bg-gray-100 w-68 mt-24 -ml-16 hover:visible'>
                        <div className="flex justify-start mb-1">
                          <img
                              src={product.image || "/api/placeholder/200/200"}
                              alt={product.libelle}
                              className="object-cover object-center rounded-sm w-12 h-10"
                          />
                        </div>
                        <h3 className="text-md font-medium text-purple-900 text-start pl-3">{product.libelle || 'Produit sans nom'}</h3>
                        <span className='text-[12px] text-purple-800 font-medium pl-5'> {product.description} </span>
                        <div className='flex flex-col pl-3 justify-between'>
                          <span className="mt-1 text-sm font-medium text-purple-800">
                            {typeof product.price === 'number' ? `${product.price} XOF` : 'Prix non disponible'}
                          </span>
                          <span className="mt-1 text-sm text-purple-600 flex font-medium items-center">{product.qte} items
                          </span>
                        </div>
                    </div>
                    <style jsx>{`
                        .has-tooltip {
                          position: relative;
                        }
                        .tooltip {
                          display: none;
                          position: absolute;
                        }

                        .has-tooltip:hover { 
                          .tooltip {
                            display: flex;
                          }
                        }
                      `}
                    </style>
                  </>
                ) : null
              ))}
          </div>
      </div>
      
          {/* Tableau des produits sélectionnés */}
          <div className="bg-white rounded-lg m-auto flex flex-col justify-between shadow-md flex-1 overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-br  from-violet-400 to-purple-500 text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Libellé du produit</th>
                  <th className="py-3 px-6 text-center">Quantité</th>
                  <th className="py-3 px-6 text-center">Prix</th>
                  <th className="py-3 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-purple-600 text-sm font-light">
                {selectedProducts!=null && (selectedProducts.map(product => (
                  <tr key={product.id} className="border-b border-purple-200 hover:bg-purple-50">
                    <td className="py-3 px-6 flex items-center space-x-4 text-center whitespace-nowrap">
                      <div className="w-12 overflow-hidden rounded-sm bg-gray-200">
                        <img
                          src={product.image || "/api/placeholder/200/200"}
                          alt={product.libelle}
                          className="object-cover object-center w-12 h-10"
                        />
                      </div>
                      <span className="text-center whitespace-nowrap"> {product.libelle} </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center">
                        {product.quantity > 1 &&(
                          <button
                          onClick={() => updateQuantity(product.id, -1)}
                            className="border-purple-400 border text-purple-800 rounded-l p-1"
                            >
                            <Minus size={16} />
                          </button>
                        )}
                        <input
                          type="text"
                          value={product.quantity}
                          onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) - product.quantity)}
                          className="w-16 text-center caret-purple-100"
                          />
                        
                        {product.quantity < product.quantityMax && (
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="border-purple-400 border text-purple-800 rounded-r p-1"
                            >
                            <Plus size={16} />
                          </button>
                        )}
                      </div>

                    </td>
                    <td className="py-3 px-6 text-center">
                      {(product.price * product.quantity).toFixed(2)} XOF
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="bg-red-500 text-white rounded p-1"
                        >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
            <div className="bg-white mt-4 p-4 rounded-b-lg flex justify-between items-center font-semibold">
              {selectedProducts != null &&(<button
                onClick={checkout}
                className="flex items-center justify-center font-medium text-white w-28 px-6 py-2 bg-gradient-to-br  from-violet-400 to-purple-500 rounded-md hover:bg-purple-800"
              >
                Commander
              </button>)}
              <span className=''>Total : {total} XOF</span>
            </div>
          </div>
        </div>
    </div>
  );
};


export default ProductManagementPage;