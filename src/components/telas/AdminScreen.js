import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import axios from 'axios';
import '../estilos/adminscreen.css';
import '../estilos/storecreated.css';
import { getData } from '../config/storage'
import swal from 'sweetalert2';

const AdminScreen = () => {
    const navigate = useNavigate();
    const [lojas, setLojas] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const initialStore = { nome: '', endereco: '' };
    const [storeName, setStoreName] = useState('Vitrine Virtual'); // Novo estado para o nome da loja
    const [store, setStore] = useState(initialStore);
    const initialProduct = { nome: '', descricao: '', preco: '', imagem: '', promocional: false, ativo: true, storeId: '' };
    const [product, setProduct] = useState(initialProduct);
    const [produtosPromocionais, setProdutosPromocionais] = useState([]);
    


    const maskPrice = (value) => {
        let v = value.replace(/\D/g,''); 
        v = (v / 100).toFixed(2) + ''; 
        v = v.replace(".", ",");
        return v;
    }
    
    

    useEffect(() => {
        const fetchStoreName = async () => {
            const user = getData('user');
            if (user && user.tipo === 'Lojista') {
                try {
                    // Substitua a URL pelo endpoint correto do seu backend
                    const response = await axios.get(`http://localhost:5000/stores?userId=${user.id}`);
                    if (response.data && response.data.length > 0) {
                        // Atualiza o nome da loja para o primeiro resultado obtido
                        setStoreName(response.data[0].nome);
                    }
                } catch (error) {
                    console.error('Erro ao buscar o nome da loja:', error);
                }
            }
        };

        fetchStoreName();
    }, []);

    const inputFileRef = useRef();

    const convertToBase64 = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const base64Image = await convertToBase64(file);

        setProduct(prevState => ({ ...prevState, imagem: base64Image }));
    };

    const fetchLojasEProdutos = async () => {
        const loggedInUser = getData('user');
        if (!loggedInUser || loggedInUser.tipo !== 'Lojista') {
            swal.fire({
                title: "Acesso Negado!",
                text: "Desculpe, você não tem acesso ao painel administrativo.",
                icon: "error",
            }).then(() => {
                navigate('/homepage');
            });
            return;
        }
    
        try {
            // Fetching the stores associated with the logged in user
            const lojasResponse = await axios.get(`http://localhost:5000/stores?userId=${loggedInUser.id}`);
            setLojas(lojasResponse.data);
            // Fetching all the products
            const produtosResponse = await axios.get('http://localhost:5000/products');
            const allProdutos = produtosResponse.data;
    
            // Filtering products that belong to the user's stores
            const userLojasIds = new Set(lojasResponse.data.map(loja => loja.id));
            const userProdutos = allProdutos.filter(produto => userLojasIds.has(produto.storeId));
            setProdutos(userProdutos);
    
            // Filtering for promotional products
            const produtosPromocionais = allProdutos.filter(produto => produto.promocional);
            setProdutosPromocionais(produtosPromocionais);
    
        } catch (error) {
            console.error("Erro ao buscar lojas ou produtos:", error);
            swal.fire(
                'Erro!',
                'Houve um problema ao buscar lojas ou produtos.',
                'error'
            );
        }
    };
    
    useEffect(() => {
        fetchLojasEProdutos();
    }, [navigate]);

    const user = getData('user');
    console.log("Usuário atual:", user);

    if (!user || user.tipo !== 'Lojista') {
        swal({
            title: "Acesso Negado!",
            text: "Desculpe, você não tem acesso ao painel administrativo.",
            icon: "error",
            button: "Entendi",
        }).then(() => {
            navigate('/homepage');
        });
        return null;
    }

    const handleStoreChange = (e) => {
        const { name, value } = e.target;
        setStore(prevState => ({ ...prevState, [name]: value }));
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({ ...prevState, [name]: value }));
    };

    const handleStoreSubmit = async (e) => {
        e.preventDefault();
        const loggedInUser = getData('user'); 
        const storeWithUserId = { ...store, userId: loggedInUser.id }; 
        try {
            await axios.post('http://localhost:5000/stores', storeWithUserId);
            // Altere para SweetAlert2
            swal.fire(
              'Sucesso!',
              'Loja cadastrada com sucesso!',
              'success'
            );
            setStoreName(store.nome); // Atualiza o estado com o nome da loja
            navigate('/homepage');
        } catch (error) {
            console.error("Erro ao salvar loja:", error);
            // Aqui também você pode usar o SweetAlert2 para mostrar o erro
            swal.fire(
              'Erro!',
              'Não foi possível cadastrar a loja.',
              'error'
            );
        }
    };
    

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const loggedInUser = getData('user'); // Supondo que isso retorne o usuário logado com sua loja.
        const userStore = lojas.find(loja => loja.userId === loggedInUser.id); // Encontrar a loja do usuário
    
        // Verifica se encontrou uma loja para o usuário
        if (userStore) {
            const productWithStoreId = { ...product, storeId: userStore.id }; // Vincula o storeId ao produto
            try {
                await axios.post('http://localhost:5000/products', productWithStoreId);
                swal.fire(
                    'Sucesso!',
                    'Produto cadastrado com sucesso!',
                    'success'
                );
                navigate('/homepage');
            } catch (error) {
                console.error("Erro ao salvar produto:", error);
                swal.fire(
                    'Erro!',
                    'Não foi possível cadastrar o produto.',
                    'error'
                );
            }
        } else {
            swal.fire(
                'Erro!',
                'Loja não encontrada para o usuário logado.',
                'error'
            );
        }
    };
    


    const handleEdit = (id) => {
        navigate(`/edit-loja/${id}`);
    };

    const handleEditProduct = (id) => {
        navigate(`/edit-product/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir essa loja?")) {
            try {
                await axios.delete(`http://localhost:5000/stores/${id}`);
                setLojas(prevLojas => prevLojas.filter(loja => loja.id !== id));
            } catch (error) {
                console.error("Erro ao excluir loja:", error);
            }
        }
    };

    const handleDeleteProduct = async (id) => {
        // SweetAlert2 para confirmação
        const result = await swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!'
        });
    
        if (result.value) {
            try {
                await axios.delete(`http://localhost:5000/products/${id}`);
                setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
                swal.fire(
                    'Excluído!',
                    'O produto foi excluído.',
                    'success'
                );
            } catch (error) {
                console.error("Erro ao excluir produto:", error);
                swal.fire(
                    'Erro!',
                    'Não foi possível excluir o produto.',
                    'error'
                );
            }
        }
    };

    return (
        <div className="admin-container">
            <div className="header">
                {storeName}
            </div>
            <NavBar />

            <h1>Painel Administrativo</h1>

            {showConfirmation && <p>Cadastro realizado com sucesso!</p>}

            <section className="section-store">
                <h2>Cadastrar Loja</h2>
                <form onSubmit={handleStoreSubmit}>
                    <input type="text" name="nome" placeholder="Nome da Loja" value={store.nome} onChange={handleStoreChange} />
                    <input type="text" name="endereco" placeholder="Endereço" value={store.endereco} onChange={handleStoreChange} />
                    <button type="submit">Salvar Loja</button>
                </form>
            </section>



            <section className="section-product">
                <h2>Cadastrar Produto</h2>
                <form onSubmit={handleProductSubmit}>
                    <input type="text" name="nome" placeholder="Nome do Produto" value={product.nome} onChange={handleProductChange} />
                    <textarea name="descricao" placeholder="Descrição" value={product.descricao} onChange={handleProductChange}></textarea>
                    <input
                        type="text"
                        name="preco"
                        placeholder="Preço"
                        value={product.preco}
                        onChange={e => {
                            const maskedValue = maskPrice(e.target.value);
                            handleProductChange({ target: { name: "preco", value: maskedValue } });
                        }}
                    />
                    <input type="file" accept="image/*" placeholder="Imagem do Produto" onChange={handleImageChange} ref={inputFileRef} />
                    <label>
                        <input type="checkbox" name="promocional" checked={product.promocional} onChange={e => setProduct({ ...product, promocional: e.target.checked })} /> Produto Promocional
                    </label>
                    <label>
                        <input type="checkbox" name="ativo" checked={product.ativo} onChange={e => setProduct({ ...product, ativo: e.target.checked })} /> Produto Ativo
                    </label>
                    <button type="submit">Salvar Produto</button>
                </form>
            </section>


            <section className="section-store-list">
                <h2>Produtos Cadastrados</h2>
                <table className="store-table">
                    <thead>
                        <tr>
                            <th>Nome do Produto</th>
                            <th>Descrição</th>
                            <th>Preço</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map(produto => (
                            <tr key={produto.id}>
                                <td>{produto.nome}</td>
                                <td>{produto.descricao}</td>
                                <td>{produto.preco}</td>
                                <td>
                                    <button onClick={() => handleEditProduct(produto.id)}>Editar</button>
                                    <button onClick={() => handleDeleteProduct(produto.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>






        </div>
    );
}

export default AdminScreen;
