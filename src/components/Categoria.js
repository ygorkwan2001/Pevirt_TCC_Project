import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { storeData, getData } from './storage';

const Categoria = () => {
  const initialData = getData('categoria') || {
    nome: ''
  };

  const [categoriaData, setCategoriaData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoriaData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    storeData('categoria', categoriaData);
    alert('Categoria salva com sucesso!');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Nome</Form.Label>
        <Form.Control type="text" name="nome" value={categoriaData.nome} onChange={handleChange} />
      </Form.Group>
      <Button type="submit">Salvar</Button>
    </Form>
  );
};

export default Categoria;
