import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getData } from '../config/storage';
import '../estilos/homepage.css';
import { FaHome, FaUser, FaInfoCircle, FaSignInAlt, FaStore, FaHeart, FaShoppingCart, FaTools } from 'react-icons/fa';
import '../estilos/products.css';
import NavBar from '../NavBar';

const HomePage = ({ setIsAuthenticated, currentUser }) => {
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const user = getData('user');
    const navigate = useNavigate();

    useEffect(() => {
        // Buscando produtos
        axios.get('http://localhost:5000/products')
            .then(response => {
                setProducts(response.data);
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
        localStorage.clear()
        navigate('/homepage');
    }

    return (
        <div className="homepage-container">
            <div className="header">
                Pevirt
            </div>

            <NavBar handleLogout={handleLogout} currentUser={currentUser} />


            <div className="products-section">
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <img src={product.imagem} alt={product.nome} className="product-image" />
                        <div className="product-details">
                            <h2>{product.nome}</h2>
                            <p>R$ {product.preco}</p>
                            <p className="product-description">{product.descricao}</p>
                            <p className="product-store">{getStoreName(product.storeId)}</p>
                            <div className="product-actions">
                                <span className="add-to-cart"><FaShoppingCart /></span>
                                <span className="favorite"><FaHeart /></span>
                            </div>

                            <div className="product-promotion">
                                {product.desconto ? <span>Desconto de {product.desconto}%</span> : null}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default HomePage;
