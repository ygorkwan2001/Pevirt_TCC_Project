import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getData } from '../config/storage';
import '../estilos/userAreaStyles.css';
import { FaUser, FaEnvelope, FaPhone, FaUserTag, FaStore } from 'react-icons/fa';


const UserInfo = ({ icon: Icon, label, data }) => (
    <p className="user-info">
        <Icon className="icon" />
        <strong>{label}:</strong> {data}
    </p>
);

const ShopkeeperAreaScreen = () => {
    const user = getData('user');
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);
    const [editedUser, setEditedUser] = useState({ ...user });


    const maskPhone = (value) => {
        return value
            .replace(/\D/g, "")
            .replace(/^(\d{2})(\d)/g, "($1) $2")
            .replace(/(\d)(\d{4})$/, "$1-$2");
    }


    if (!user) {
        Swal.fire({
            title: 'Erro',
            text: 'Você precisa estar logado para acessar esta área.',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(() => {
            navigate('/homepage');
        });
        return null;
    }

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/users/${user.id}`, editedUser);
            if (response.status === 200) {
                Swal.fire({
                    title: 'Sucesso',
                    text: 'Dados atualizados com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                setIsEditing(false);
                setCurrentUser(editedUser);
            }
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            Swal.fire({
                title: 'Erro',
                text: 'Houve um erro ao atualizar os dados. Por favor, tente novamente.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    const handleBackToHomepage = () => {
        navigate('/homepage');
    }

    const handleDelete = () => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Você quer mesmo excluir sua conta?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`http://localhost:5000/users/${user.id}`);
                    if (response.status === 200) {
                        Swal.fire({
                            title: 'Sucesso',
                            text: 'Conta excluída com sucesso!',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            // Limpar os dados do usuário do armazenamento local
                            localStorage.removeItem('user');  // Supondo que você esteja usando localStorage

                            // Redirecionar para a página inicial
                            navigate('/homepage');
                        });
                    }
                } catch (error) {
                    console.error("Erro ao excluir usuário:", error);
                    Swal.fire({
                        title: 'Erro',
                        text: 'Houve um erro ao excluir a conta. Por favor, tente novamente.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }
        });
    }

    return (
        <div className="user-area-container">
            <div className="card">
                <div className="card-header">
                    <h2 className="user-title">Informações do Lojista</h2>
                    {!isEditing && <button onClick={handleEdit}>Editar</button>}
                    {isEditing && <button onClick={handleSave}>Salvar</button>}
                    <button onClick={handleDelete}>Excluir Conta</button>

                    <button onClick={handleBackToHomepage}>Voltar à Homepage</button>

                </div>
                <UserInfo icon={FaUser} label="Nome" data={isEditing ? <input value={editedUser.nome} onChange={e => setEditedUser({ ...editedUser, nome: e.target.value })} /> : currentUser.nome} />
                <UserInfo icon={FaEnvelope} label="Email" data={isEditing ? <input value={editedUser.email} onChange={e => setEditedUser({ ...editedUser, email: e.target.value })} /> : currentUser.email} />
                <UserInfo
                    icon={FaPhone}
                    label="Telefone"
                    data={isEditing ?
                        <input value={maskPhone(editedUser.telefone)} onChange={e => setEditedUser({ ...editedUser, telefone: e.target.value })} />
                        :
                        maskPhone(currentUser.telefone)}
                />

                <UserInfo icon={FaUserTag} label="Tipo" data={isEditing ? <input value={editedUser.tipo} onChange={e => setEditedUser({ ...editedUser, tipo: e.target.value })} /> : currentUser.tipo} />
            </div>
        </div>
    );
};

export default ShopkeeperAreaScreen;