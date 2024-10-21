import React, { useEffect, useState } from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import ClientList from "./ClientList";
import BoutiqueCard from '../Achats/BoutiqueCard';
import {useAuth} from "../../context/AuthContext";
import { useActor } from "../../context/ActorContext";
import useCrud from "../../hooks/useCrudAxiosElse";
import AlertService from "../../services/notifications/AlertService";
import Navbar from '../UserProfile/Navbar';

const OrderItem = ({ id, image, libelle, qte, price }) => {
  return (
    <tr className="border-b">
      <td className="p-2 space-x-4 flex items-center whitespace-nowrap">
        <img src={image} alt="Product" className="w-12 h-12 object-cover" />
        <span> {libelle} </span>
      </td>
      <td className="py-2 px-4">
        <div className="flex items-center">
          <span className="px-4 py-1 bg-gray-50 text-center">{qte}</span>
        </div>
      </td>
      <td className="py-2 px-4">{price * qte}</td>
    </tr>
  );
};

const Commandesummary = ({ items}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.qte, 0);
  return (
    <div className="bg-white w-2/3 rounded-lg m-auto flex flex-col justify-between shadow-md overflow-y-auto">
      <table >
        <thead>
          <tr className="bg-gradient-to-br from-violet-400 to-purple-500 text-white uppercase text-sm leading-normal">
            <th className="p-4 pl-7 text-start">Produits</th>
            <th className="py-4 text-start">Quantité</th>
            <th className="px-5 py-4 text-start">Prix</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <OrderItem key={index} id={ item.id } image={ item.image } libelle={ item.libelle } qte={ item.qte }  price= { item.price } />
          ))}
        </tbody>
      </table>
      <div className="bg-white h-full mt-4 p-4 rounded-b-lg flex justify-between font-semibold">
        <span>Total :</span>
        <span>{total}</span>
      </div>
    </div>
  );
};

const InfosCommande = ({client, commande, onclick, onCancel}) => {
  return (
    <div className="bg-white w-2/3 rounded-lg m-auto flex flex-col justify-between shadow-md overflow-y-auto">
      <table >
        <thead>
          <tr className="bg-gradient-to-br from-violet-400 to-purple-500 text-white uppercase text-sm leading-normal">
            <th className="text-left p-3 ml-3"><h3 className="font-semibold">Client</h3></th>
            <th className="text-left p-3"><h3 className="font-semibold">Email</h3></th>
            <th className="p-1"><h3 className="font-semibold">Tel</h3></th>
          </tr>
        </thead>
        <tbody className="border-t pt-4">
          <tr>
            <td className="flex items-center p-2 text-purple-600">
              <img src={client.photo} alt={client.firstname+' '+client.lastname} className="w-16 h-16 rounded-full mr-2" />
              <span>{client.firstname+' '+client.lastname}</span>
            </td>
            <td className="p-2 text-purple-600">{client.email}</td>
            <td className="p-2 text-purple-600">
              {client.phone}
            </td>
          </tr>
        </tbody>
      </table>
      {commande.statut === 'PENDING' && (
        <div className="mt-4 flex justify-between rounded-b-lg p-4 bg-white">
          <button className="px-4 py-2 bg-purple-600 text-white rounded" onClick={ onclick }>Valider</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={ onCancel }>Annuler</button>
        </div>)}
      {commande.statut === 'VALIDATED' && (<div  className="flex justify-center items-center">
          <div className='p-3 rounded-xl bg-green-500 text-white text-center'>
            Commande Validée
          </div>
        </div>)}
      {commande.statut === 'CANCELED' && (<div  className="flex justify-center items-center">
          <div className='p-3 rounded-xl bg-red-500 text-white text-center'>
            Commande Annulée
          </div>
        </div>)}
    </div>
  );
};

const CommandeDetails = (vendor) => {
  const [commandes, setCommandes] = useState([]);
  const [commandeSelected, setCommandeSelected] = useState(null);
  const productsCommande = commandeSelected?.produits;
  const { user } = useAuth();
  const { actor } = useActor();
  const vendorId = actor?.id;
  console.log(vendorId)
  // Appel de useCrud ici
  const { get, update } = useCrud('produits/commandes');

  const fetchCommandes = async () => {
    try {
      const data = await get(`vendor/${vendorId}`);
      setCommandes(data.filter(commande => commande.statut === 'PENDING'));
    } catch (error) {
      console.error('Error fetching commandes:', error);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, [vendorId]);

  const validateCommande = async (commande) => {
    try {
      const response = await update(`${commande.id}/valider`, {
        statut: 'VALIDATED'
      });
  
      if (response) {
        alert('Commande validée avec succès!');
        setCommandeSelected(null);
        fetchCommandes();
        const updatedCommandes = await get(`vendor/${vendorId}`);
        setCommandes(updatedCommandes.filter(commande => commande.statut === 'PENDING'));
      }
    } catch (error) {
      console.error("Erreur lors de la validation de la commande :", error);
      alert("Erreur lors de la validation de la commande. Veuillez réessayer.");
    }
  };
  
  const cancelCommande = async (commande) => {
    try {
      const response = await update(`${commande.id}/annuler`, {
        statut: 'CANCELED'
      });
  
      if (response) {
        alert('Commande annulée avec succès!');
        setCommandeSelected(null);
        fetchCommandes();
        const updatedCommandes = await get(`vendor/${vendorId}`);
        setCommandes(updatedCommandes.filter(commande => commande.statut === 'PENDING'));
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation de la commande :", error);
      alert("Erreur lors de l'annulation de la commande. Veuillez réessayer.");
    }
  };

  const client = commandeSelected?.user;
  
  const onBack = () => {
    setCommandeSelected(null);
  };

  const message = () => {
    alert(`Message to ${client.firstname} ${client.lastname}`);
  };

  return (
    <div className="min-h-screen h-full bg-white">
      <Navbar />
      <main className="container mx-auto mt-16 p-4">
        {commandeSelected ? (
          <>
            <button className="bg-gradient-to-br from-violet-400 to-purple-500 flex fixed bottom-1 left-3 ml-16 justify-center items-center text-white rounded-full rounded-bl_ p-3 animate-bounce" onClick={message}>
              <MessageSquare className="animate-pulse" size={24} />
            </button>
            <button onClick={onBack} className="flex items-center text-purple-600 hover:text-purple-800 mb-4">
              <ArrowLeft className="mr-2" size={20} />
              Retour à la liste des commandes
            </button>
            <div className='flex flex-col justify-between items-center space-y-4'>
              <InfosCommande client={client} commande= {commandeSelected} onclick={() => validateCommande(commandeSelected)} onCancel={() => cancelCommande(commandeSelected)} />
              <Commandesummary items={productsCommande} />
            </div>
          </>
        ) : (
          <div className="flex flex-col space-y-4">
            <ClientList commandes={commandes} onSelectCommande={setCommandeSelected} />
          </div>
        )}
      </main>
    </div>
  );
};

export default CommandeDetails;