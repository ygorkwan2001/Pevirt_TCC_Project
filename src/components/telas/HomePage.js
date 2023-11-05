import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getData } from '../config/storage';
import '../estilos/homepage.css';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import NavBar from '../NavBar';
import { ProdutosPromocionais } from '../ProdutosPromocionais';

const HomePage = ({ setIsAuthenticated, currentUser }) => {
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const user = getData('user');
    const navigate = useNavigate();
    const [produtosPromocionais, setProdutosPromocionais] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/products')
            .then(response => {
                setProducts(response.data);
                const promocionais = response.data.filter(p => p.promocional);
                setProdutosPromocionais(promocionais);
            })
            .catch(error => {
                console.error("Erro ao buscar os produtos:", error);
            });
        axios.get('http://localhost:5000/stores')
            .then(response => {
                setStores(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar as lojas:", error);
            });
    }, []);

    const getStoreName = (storeId) => {
        const store = stores.find(store => Number(store.id) === Number(storeId));
        return store ? store.nome : 'Desconhecido';
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/homepage');
    }

    return (
        <div className="homepage-container">
            <div className="header">
                Vitrine Virtual
            </div>

            <NavBar handleLogout={handleLogout} currentUser={currentUser} />

            {/* Carrossel de produtos promocionais */}
            <ProdutosPromocionais produtos={produtosPromocionais} />

            <div className="products-section">
                {/* Exibindo apenas produtos que não estão marcados como promocionais */}
                {products.filter(product => !product.promocional).map((product) => (
                    <div key={product.id} className="product-item">
                        <img src={product.imagem} alt={product.nome} className="product-image" />
                        <div className="product-details">
                            <h2>{product.nome}</h2>
                            <p className="product-price" >R$ {product.preco}</p>
                            <p className="product-description">{product.descricao}</p>
                            <p className="product-store">{getStoreName(product.storeId)}</p>
                            <div className="product-actions">
                                {user && user.tipo === 'Cliente' && (
                                    <>
                                        <span className="add-to-cart"><FaShoppingCart /></span>
                                        <span className="favorite"><FaHeart /></span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
