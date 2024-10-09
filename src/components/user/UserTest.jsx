import React, { useEffect } from 'react';
import useCrud from "../../hooks/useCrudAxios";


const UserList = () => {
    const { data: users, loading, error, get, create, update, remove } = useCrud('http://localhost:5000/api/v1');

    useEffect(() => {
        get();
        console.log(users);
        }, [users]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error.message}</p>;

    return (
        <div>

        </div>
    );
};

export default UserList;