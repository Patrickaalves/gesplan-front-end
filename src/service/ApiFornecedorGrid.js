import axios from 'axios';

// Cria a instância do axios
const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// buscaTodosOsFornecedores
api.getCadastros = function() {
  return this.get('fornecedor?sort=favorito,desc');
};

api.updateFornecedor = function(fornecedor) {

  // remove o atributo id, para ele não ser mandado no body
  const { id: _, ...fornecedorNovo } = fornecedor;

  return this.put(`fornecedor/${fornecedor.id}`, fornecedorNovo);
};

export default api;
