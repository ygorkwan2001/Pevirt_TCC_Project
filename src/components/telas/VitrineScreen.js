// src/components/CardapioEletronicoScreen.js

import React from 'react';
import CardapioEletronico from '../CardapioEletronico';

const VitrineScreen = () => {
  return (
    <div className="container mt-5">
      <h1>Configuração do Cardápio Eletrônico</h1>
      <CardapioEletronico />
    </div>
  );
};

export default CardapioEletronicoScreen;
