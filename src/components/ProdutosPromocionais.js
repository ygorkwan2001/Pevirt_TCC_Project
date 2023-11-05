import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./estilos/homepage.css"; 

export const ProdutosPromocionais = ({ produtos }) => {
    return (
        <Carousel autoPlay interval={3000} infiniteLoop useKeyboardArrows dynamicHeight>
            {produtos.map(produto => (
                <div key={produto.id}>
                    <img src={produto.imagem} alt={produto.nome} />
                    <h3>{produto.nome}</h3>
                    <p>{produto.descricao}</p>
                    <p>Preço: R${produto.preco}</p>
                </div>
            ))}
        </Carousel>
    );
};
