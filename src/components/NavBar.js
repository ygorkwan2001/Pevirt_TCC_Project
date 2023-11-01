import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaHome, FaInfoCircle, FaSignInAlt, FaStore, FaTools, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NavBar = ({ handleLogout, currentUser }) => {
    return (
        <Nav className="nav">
            <Nav.Link as={Link} to="/"><FaHome /> Início</Nav.Link>
            
            {currentUser && currentUser.tipo === 'Lojista' && (
                <>
                    <Nav.Link as={Link} to="/area-logista"><FaStore /> Info Lojista</Nav.Link>
                    <Nav.Link as={Link} to="/admin"><FaTools /> Painel Administrativo</Nav.Link>
                </>
            )}

            {currentUser && currentUser.tipo === 'Cliente' && (
                <Nav.Link as={Link} to="/area-cliente"><FaUser /> Info Cliente</Nav.Link>
            )}

            <Nav.Link as={Link} to="/login" onClick={handleLogout}><FaSignInAlt /> Entrar/Sair</Nav.Link>
        </Nav>
    );
}

export default NavBar;
