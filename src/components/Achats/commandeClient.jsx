import React, { useState, useEffect } from 'react';
import { Search } from "lucide-react";
import ProductManagementPage from './ProductManagement';
import VendorList from './VendorList';
import useCrud from '../../hooks/useCrudAxios';

// Composant principal qui gère la navigation entre les pages
const CommandeClient = () => {
  const { data: vendeurs, loading: vendorsLoading, error: vendorsError, get: getVendors } = useCrud('actors/getactors/?actor=VENDOR');
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Récupérer les fournisseurs lors du premier rendu
  useEffect(() => {
    getVendors(); // Appelle la méthode get pour récupérer les fournisseurs
  }, []);
  
  // Filtrer les vendeurs lorsque les données changent
  useEffect(() => {
    if (vendeurs) {
      setFilteredVendors(vendeurs.filter(vendor => vendor.role === 'VENDOR'));
    }
  }, [vendeurs]);

  const handleBack = () => {
    setSelectedVendor(null);
  };

  return (
    <div>
      {vendorsLoading ? (
        <p>Chargement des données...</p>
      ) : vendorsError ? (
        <p>Erreur : {vendorsError.message}</p>
      ) : (
        selectedVendor ? (
          <ProductManagementPage vendor={selectedVendor} onBack={handleBack} />
        ) : (
          <VendorList vendors={filteredVendors} onSelectVendor={setSelectedVendor} />
        )
      )}
    </div>
  );
};

export default CommandeClient;