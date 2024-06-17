import axios from 'axios';

// Cria a instância do axios
const api = axios.create({
  baseURL: 'http://localhost:8080/fornecedor'
});

/*
Ao usar a baseURL ela por padrao manda sempre com uma / e isso quebra a url fazendo não buscar direito
Para resovler, usar a UrlBaseApis
*/

let UrlBaseApis = 'http://localhost:8080/fornecedor'

api.salvarFornecedor = function(fornecedor){
  return this.post(`${UrlBaseApis}`,fornecedor)
}

// faz a busca dos fornecedores para listar na grid
api.listarFornecedoresGrid = function() {
  return this.get(`${UrlBaseApis}?sort=favorito,desc`);
};

api.buscarFornecedorPorId = function(fornecedorId){
  return this.get(`${fornecedorId}`)
}

api.atualizarCampoFavoritoFornecedor = function(fornecedor) {
  // remove o atributo id, para ele não ser mandado no body
  const { id: _, ...fornecedorNovo } = fornecedor;

  return this.put(`${fornecedor.id}`, fornecedorNovo);
};

api.atualizarFornecedorPorId = function( fornecedorId,fornecedor) {
  // remove o atributo id, para ele não ser mandado no body
  return this.put(`${fornecedorId}`, fornecedor);
};

api.apagarFornecedoresPorId = function(idFornecedor){
  return this.delete(`${idFornecedor}`)
}


export default api;
