import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const Header = () => (
    <header className="bg-purple-600 p-4 flex justify-between items-center">
        <div className="flex items-center">
            <svg className="w-8 h-8 text-white mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6H4V18H20V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 10H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-white text-xl font-semibold">Mon Réseau Social</h1>
        </div>
        <div className="flex items-center">
            <input
                type="search"
                placeholder="Rechercher"
                className="px-4 py-2 rounded-full mr-4"
            />
            <button className="text-white mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
            </button>
            <button className="text-white mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
            </button>
            <img src="/api/placeholder/40/40" alt="Profile" className="w-10 h-10 rounded-full" />
        </div>
    </header>
);

const OrderItem = ({ id, image, quantity, price, onQuantityChange, onclick }) => {
    return (
        <tr className="border-b">
            <td className="p-2">
                <img src={image} alt="Product" className="w-12 h-12 object-cover" />
            </td>
            <td className="p-2">
                <div className="flex items-center">
                    <button className="px-2 py-1 bg-gray-200 rounded-l" onClick={() => onQuantityChange(-1)}>-</button>
                    <span className="px-4 py-1 bg-gray-100">{quantity}</span>
                    <button className="px-2 py-1 bg-gray-200 rounded-r" onClick={() => onQuantityChange(1)}>+</button>
                </div>
            </td>
            <td className="p-2">{price * quantity}</td>
            <td className="p-2">
                <button onClick={onclick} className="bg-red-500 text-white rounded p-1">
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
};

const OrderSummary = ({ items, client, onQuantityChange, onclick }) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="bg-purple-400 flex flex-col space-y-0 rounded-lg shadow">
            <table className="bg-white p-4 w-full mt-2 text-center font-semibold rounded-t-lg">
                <thead className="bg-purple-400">
                <tr>
                    <th className="p-2">Produits</th>
                    <th className="p-2">Quantité</th>
                    <th className="p-2">Prix</th>
                    <th className="p-2"> - </th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                    <OrderItem key={index} {...item} onQuantityChange={(change) => onQuantityChange(index, change)} onclick={onclick} />
                ))}
                </tbody>
            </table>
            <div className="bg-white mt-4 p-4 rounded-b-lg flex justify-between font-semibold">
                <span>Total :</span>
                <span>{total}</span>
            </div>
        </div>
    );
};

const InfosCommande = (client) => {
    return (
        <div className="bg-purple-400 w-1/3 h-1/2 flex flex-col space-y-0 rounded-lg shadow">
            <table className="w-full p-4 bg-white mt-2 text-center">
                <thead className="bg-purple-400 ">
                <tr>
                    <th className="text-left p-2"><h3 className="font-semibold">Client</h3></th>
                    <th className="text-left p-2"><h3 className="font-semibold">Email</h3></th>
                    <th className="p-1"><h3 className="font-semibold">Discuter</h3></th>
                </tr>
                </thead>
                <tbody className="border-t pt-4">
                <tr>
                    <td className="flex items-center p-2">
                        <img src={client.image} alt={client.name} className="w-10 h-10 rounded-full mr-2" />
                        <span>{client.name}</span>
                    </td>
                    <td className="p-2">{client.email}</td>
                    <td className="p-2">
                        <button className="px-2 py-1 bg-blue-500 text-white rounded">Chat</button>
                    </td>
                </tr>
                </tbody>
            </table>
            <div className="mt-4 flex justify-between rounded-b-lg p-4 bg-white">
                <button className="px-4 py-2 bg-purple-600 text-white rounded">Valider</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded">Annuler</button>
            </div>
        </div>
    );
};

const CommandeDetails = () => {
    const [email, setEmail] = useState('');
    const [orderId, setOrderId] = useState(null);
    const [orders, setOrders] = useState([]);

    const [clientName, setClientName] = useState('Fatima');
    const removeProduct = (productId) => {
        setOrders(orders.filter(p => p.id !== productId));
    }
    const handleSearch = () => {
        const foundOrder = orders.find(order => order.email === email && order.status === 'pending');
        if (foundOrder) {
            setOrderId(foundOrder.id);
        } else {
            alert('Aucune commande en attente trouvée pour cet email.');
        }
    };

    const handleToThisOrder = () => {
        const newOrder = {
            id: orders.length + 1,
            email,
            clientName,
            products: [
                { image: "/api/placeholder/48/48", quantity: 2, price: 2000 },
                { image: "/api/placeholder/48/48", quantity: 2, price: 2000 },
                { image: "/api/placeholder/48/48", quantity: 2, price: 2000 },
            ],
            status: 'pending',
        };
        setOrders([...orders, newOrder]);
        setOrderId(newOrder.id);
    };

    const handleQuantityChange = (index, change) => {
        const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
                const updatedProducts = order.products.map((product, i) => {
                    if (i === index) {
                        return { ...product, quantity: product.quantity + change };
                    }
                    return product;
                });
                return { ...order, products: updatedProducts };
            }
            return order;
        });
        setOrders(updatedOrders);
    };

    const client = {
        name: clientName,
        image: "/api/placeholder/40/40",
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto mt-8 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Commandes</h2>
                    <div className="flex">
                        <button className="mr-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </button>
                        <button onClick={handleToThisOrder}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Rechercher par email"
                        className="border p-2 rounded w-full"
                    />
                    <button onClick={handleSearch} className="bg-purple-600 text-white px-4 py-2 rounded mt-2 hover:bg-purple-700">
                        Rechercher
                    </button>
                    <br />

                    <button onClick={handleToThisOrder} className="bg-purple-600 text-white px-4 py-2 rounded mt-2 hover:bg-purple-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                </div>
                {orderId && (
                    <div className='flex justify-around'>
                        <OrderSummary
                            items={orders.find(order => order.id === orderId).products}
                            client={client}
                            onQuantityChange={handleQuantityChange}
                            onclick={removeProduct}
                        />
                        <InfosCommande client={client} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default CommandeDetails;