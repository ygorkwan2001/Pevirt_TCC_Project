import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { storeData, getData } from './storage';

const SubCategoria = () => {
  const initialData = getData('subcategoria') || {
    nome: ''
  };

  const [subCategoriaData, setSubCategoriaData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoriaData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    storeData('subcategoria', subCategoriaData);
    alert('SubCategoria salva com sucesso!');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Nome</Form.Label>
        <Form.Control type="text" name="nome" value={subCategoriaData.nome} onChange={handleChange} />
      </Form.Group>
      <Button type="submit">Salvar</Button>
    </Form>
  );
};

export default SubCategoria;
