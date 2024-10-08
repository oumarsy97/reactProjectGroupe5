import React, { useState } from 'react';
const Moncomposant =  () => {
    const [montext,setMontext] = useState('Bonjours');
    return (
        <div>
            <h1 className={"mt-3"}>{montext}</h1>
        </div>
    )
}

export default Moncomposant;