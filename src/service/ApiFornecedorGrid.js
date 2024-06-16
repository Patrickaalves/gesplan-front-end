import axios from 'axios';

// Cria a instância do axios
const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// buscaTodosOsFornecedores
api.getCadastros = function() {
  return this.get('fornecedor?sort=favorito,desc');
};

api.getFornecedorPorId = function(fornecedorId){
  return this.get(`fornecedor/${fornecedorId}`)
}

api.updateFornecedorFavorito = function(fornecedor) {
  // remove o atributo id, para ele não ser mandado no body
  const { id: _, ...fornecedorNovo } = fornecedor;

  return this.put(`fornecedor/${fornecedor.id}`, fornecedorNovo);
};

api.updateFornecedor = function( fornecedorId,fornecedor) {
  // remove o atributo id, para ele não ser mandado no body
  return this.put(`fornecedor/${fornecedorId}`, fornecedor);
};

api.deletarFornecedor = function(idFornecedor){
  return this.delete(`fornecedor/${idFornecedor}`)
}

api.salvarFornecedor = function(fornecedor){
  return this.post('fornecedor',fornecedor)
}


export default api;
