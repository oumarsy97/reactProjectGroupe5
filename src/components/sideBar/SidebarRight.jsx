import React, { useState } from 'react';
import {  TrendingUp, Coins, Gift, History, ArrowLeft } from 'lucide-react';
import useCrud from "../../hooks/useCrudAxios";
import {useActor} from "../../context/ActorContext";
import AlertService from "../../services/notifications/AlertService";
import ProfileChangeForm from "../user/ProfileChangeForm";

const SidebarRight = () => {
    const [showCreditHistory, setShowCreditHistory] = useState(false);
    const [creditSection, setCreditSection] = useState('main'); // 'main', 'buy', 'code'
    const [purchaseAmount, setPurchaseAmount] = useState('');
    const [purchaseCode, setPurchaseCode] = useState('');
    const { create: createCredit } = useCrud('users/achatcode');
    const { create: addCredit } = useCrud('users/ajoutercredits');

    const { actor, setActor } = useActor();
    const [loading, setLoading] = useState(false);
    const [isloading, setIsLoading] = useState(false)



    const CREDIT_RATE = 100; // 1 crédit = 100 F CFA

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

    const handlePurchaseAmountChange = (e) => {
        const value = e.target.value;
        setPurchaseAmount(value);
    };

    const calculateCredits = () => {
        const amount = parseFloat(purchaseAmount);
        if (isNaN(amount) || amount <= 0) return 0;
        return Math.floor(amount / CREDIT_RATE);
    };
    const hundlAchat = async () => {
        if (purchaseAmount < 100) {
            await AlertService.error('Veuillez saisir un montant valide minmimum 100fr');
            return;
        }
        setLoading(true);
        const response = await createCredit({ montant: +purchaseAmount });
       // console.log(response);
            AlertService.success('Achat réussi veuillez consulter votre email ou votre téléphone pour voir votre code ! ',4000);
     setLoading(false);
     setPurchaseAmount(0);
    }
    const handleCode = async () => {
        if (purchaseCode.length !== 12 || purchaseCode.length === 0){
            await AlertService.error('Veuillez saisir un code  de 12 chiffres');
            return;
        }
        try {

        setIsLoading(true);

        const response = await addCredit({ code: purchaseCode });

            AlertService.success('Ajout de crédits réussi!',4000);
            console.log(response)
            setPurchaseCode(0);
           setActor({...actor, credits: response.credits} )
        }catch (error) {
                await AlertService.error('votre code est invalide');
             setPurchaseCode(0);
        }
     setIsLoading(false);
    }

    const handlePurchaseCodeChange =(e)=> {
        const value = e.target.value;
        setPurchaseCode(value);
    }

    const renderCreditSection = () => {
        switch (creditSection) {
            case 'buy':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif text-xl font-bold">Acheter des crédits</h3>
                            <button onClick={() => setCreditSection('main')} className="text-white/80 hover:text-white">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm">Montant (F CFA)</label>
                            <input
                                type="number"
                                min="0"
                                value={purchaseAmount}
                                onChange={handlePurchaseAmountChange}
                                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20"
                                placeholder="Entrez le montant"
                            />
                        </div>
                        {purchaseAmount && (
                            <div className="text-sm text-white/80">
                                Vous obtiendrez <span className="font-bold text-white">{calculateCredits()} crédits</span>
                            </div>
                        )}
                        <button disabled={loading} className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors" onClick={hundlAchat}>
                            {loading ? 'Achat en cours...' : 'Acheter'}
                        </button>
                    </div>
                );
            case 'code':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif text-xl font-bold">Utiliser un code</h3>
                            <button onClick={() => setCreditSection('main')} className="text-white/80 hover:text-white">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm">Code de rachat</label>
                            <input
                                type="number"
                                value={purchaseCode}
                                min="0"
                                onChange={handlePurchaseCodeChange}
                                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20"
                                placeholder="Entrez votre code"
                            />
                        </div>
                        <button disabled={isloading} onClick={handleCode} className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                            {isloading ? 'Validation en cours...' : 'Valider'}
                        </button>
                    </div>
                );
            default:
                return (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-white/80 text-sm">Vos crédits</p>
                                <h3 className="font-serif text-3xl font-bold">{actor.credits}</h3>
                            </div>
                            <Coins className="h-8 w-8 text-yellow-300" />
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                                onClick={() => setCreditSection('buy')}
                                className="bg-white/10 hover:bg-white/20 rounded-lg p-3 text-center backdrop-blur-sm transition-all duration-200"
                            >
                                <div className="font-bold">Acheter</div>
                            </button>
                            <button
                                onClick={() => setCreditSection('code')}
                                className="relative bg-white/10 hover:bg-white/20 rounded-lg p-3 text-center backdrop-blur-sm transition-all duration-200"
                            >
                                <div className="font-bold">Entrez code</div>
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
                                        <div className={`font-bold ${transaction.amount > 0 ? 'text-green-300' : 'text-red-300'}`}>
                                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="col-span-3">
            <div className="space-y-6 sticky top-24">
                {/* Section Crédits */}
                <div className="bg-gradient-to-b from-black to-purple-900 rounded-xl shadow-lg p-6 text-white">
                    {actor && renderCreditSection()}
                    {!actor && <ProfileChangeForm />}
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
                            className="py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
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