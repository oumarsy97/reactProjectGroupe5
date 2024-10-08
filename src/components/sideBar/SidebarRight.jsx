import React, { useState } from 'react';
import { Star, CreditCard, TrendingUp, Coins, Gift, History } from 'lucide-react';

const SidebarRight = () => {
    const [currentCredits, setCurrentCredits] = useState(150);
    const [showCreditHistory, setShowCreditHistory] = useState(false);

    const trends = [
        { tag: '#CoutureDurable', posts: '1.2k' },
        { tag: '#StylePrintemps', posts: '956' },
        { tag: '#PatronGratuit', posts: '847' }
    ];

    const creators = [
        { name: 'Laura Mode', specialty: 'Haute Couture', avatar: '/api/placeholder/40/40' },
        { name: 'Alex Design', specialty: 'Streetwear', avatar: '/api/placeholder/40/40' },
        { name: 'Marie Fil', specialty: 'Accessoires', avatar: '/api/placeholder/40/40' }
    ];

    const creditHistory = [
        { date: '2024-03-15', type: 'Achat', amount: 500, price: '39.99€' },
        { date: '2024-03-10', type: 'Utilisé', amount: -100 },
        { date: '2024-03-05', type: 'Bonus', amount: 50 }
    ];

    const handleBuyCredits = (amount) => {
        console.log(`Opening credit purchase modal for ${amount} credits`);
    };

    return (
        <div className="col-span-3">
            <div className="space-y-6 sticky top-24">
                {/* Section Crédits */}
                <div className="bg-gradient-to-b from-black to-purple-900 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-white/80 text-sm">Vos crédits</p>
                            <h3 className="font-serif text-3xl font-bold">{currentCredits}</h3>
                        </div>
                        <Coins className="h-8 w-8 text-yellow-300" />
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <button
                            onClick={() => handleBuyCredits(100)}
                            className="bg-white/10 hover:bg-white/20 rounded-lg p-3 text-center backdrop-blur-sm transition-all duration-200"
                        >
                            <div className="font-bold">100</div>
                            <div className="text-xs text-white/80">9.99€</div>
                        </button>
                        <button
                            onClick={() => handleBuyCredits(500)}
                            className="relative bg-white/10 hover:bg-white/20 rounded-lg p-3 text-center backdrop-blur-sm transition-all duration-200"
                        >
                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full">
                                -20%
                            </div>
                            <div className="font-bold">500</div>
                            <div className="text-xs text-white/80">39.99€</div>
                        </button>
                        <button
                            onClick={() => handleBuyCredits(1000)}
                            className="bg-white/10 hover:bg-white/20 rounded-lg p-3 text-center backdrop-blur-sm transition-all duration-200"
                        >
                            <div className="font-bold">1000</div>
                            <div className="text-xs text-white/80">69.99€</div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setShowCreditHistory(!showCreditHistory)}
                            className="flex items-center text-sm text-white/80 hover:text-white transition-colors duration-200"
                        >
                            <History className="h-4 w-4 mr-1" />
                            Historique
                        </button>
                        <Gift className="h-5 w-5 text-yellow-300" />
                    </div>

                    {showCreditHistory && (
                        <div className="mt-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                            {creditHistory.map((transaction, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                                >
                                    <div>
                                        <p className="text-sm">{transaction.type}</p>
                                        <p className="text-xs text-white/70">{transaction.date}</p>
                                    </div>
                                    <div className={`font-bold ${
                                        transaction.amount > 0 ? 'text-green-300' : 'text-red-300'
                                    }`}>
                                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tendances */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-serif text-lg font-semibold">Tendances</h3>
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    {trends.map((trend) => (
                        <div
                            key={trend.tag}
                            className="py-3 border-b-red-100 border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        >
                            <p className="font-medium text-gray-900">{trend.tag}</p>
                            <p className="text-sm text-gray-500">{trend.posts} posts</p>
                        </div>
                    ))}
                </div>

                {/* Suggestions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-serif text-lg font-semibold mb-4">Créateurs à suivre</h3>
                    {creators.map((creator) => (
                        <div
                            key={creator.name}
                            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                            <div className="flex items-center">
                                <img
                                    src={creator.avatar}
                                    alt={creator.name}
                                    className="h-10 w-10 rounded-full bg-gray-200 object-cover"
                                />
                                <div className="ml-3">
                                    <p className="font-medium text-gray-900">{creator.name}</p>
                                    <p className="text-sm text-gray-500">{creator.specialty}</p>
                                </div>
                            </div>
                            <button
                                className="px-4 py-1 text-white text-sm font-medium rounded-full bg-gradient-to-br from-black to-purple-900 hover:opacity-90 transition-opacity duration-200"
                            >
                                Suivre
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SidebarRight;