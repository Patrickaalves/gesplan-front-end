<template>
    <div>
      <h2>Lista de Fornecedores</h2>
      <div v-if="fornecedores && fornecedores.content.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th><input type="checkbox" disabled /></th>
              <th scope="col">NOME</th>
              <th scope="col">EMAIL</th>
              <th scope="col">TELEFONE</th>
              <th scope="col">TIPO DE FORNECEDOR</th>
              <th scope="col">OBSERVACAO</th>
              <th scope="col" ><i class="bi bi-star"></i></th> 
            </tr>
          </thead>
          <tbody>
            <tr v-for="fornecedor in fornecedores.content" :key="fornecedor.id">
              <td><input type="checkbox" /></td>
              <td>{{ fornecedor.nome }}</td>
              <td>{{ fornecedor.email }}</td>
              <td>
                  <div v-for="telefone in telefones[fornecedor.id]" :key="telefone.id">
                    {{ telefone.numeroTelefone }}
                  </div>
              </td>
              <td>{{ fornecedor.tipoDeFornecedor }}</td>
              <td>{{ fornecedor.observacao }}</td>
              <td>
                <i class="bi bi-star-fill"
                   :class="{ 'star-selected': fornecedor.favorito }"
                   @click="alternarFavorito(fornecedor)"
                   >
                </i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>Nenhum fornecedor encontrado.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, defineComponent, onMounted } from 'vue';
  import apiFornecedores from '@/service/ApiFornecedorGrid.js';
  import apiFornecedoresTelefone from '@/service/ApiFornecedoresTelefone';
  
  export default defineComponent({
    setup() {
      const fornecedores = ref(null);
      const telefones = ref({});
  
      const fetchFornecedores = () => {
        apiFornecedores.getCadastros()
          .then(response => {
            fornecedores.value = response.data;
            fornecedores.value.content.forEach(fornecedor => {

              fetchTelefonesFornecedor(fornecedor.id);
            });
          })
          .catch(error => {
            console.error('Erro ao buscar fornecedores:', error);
          });
      };
  
      const fetchTelefonesFornecedor = (id) => {
        apiFornecedoresTelefone.getTelefones(id)
          .then(response => {
            telefones.value[id] = response.data;
          })
          .catch(error => {
            console.error('Erro ao buscar telefones do fornecedor:', error);
          });
      };

      const alternarFavorito = (fornecedor) => {
        fornecedor.favorito = !fornecedor.favorito;

        apiFornecedores.updateFornecedor(fornecedor)        
        .catch(error => {
            console.error('Erro ao atualizar fornecedor:', error);
        });
      };
  
      onMounted(() => {
        fetchFornecedores();
      });
  
      return {
        fornecedores,
        telefones,
        alternarFavorito
      };
    },
  });
  </script>
  
<style>
 .bi-star-fill {
    cursor: pointer;
    transition: color 0.3s, background-color 0.3s;
  }
  
  .star-selected {
    color: gold;
    background-color: rgba(255, 215, 0, 0.3); 
    border-radius: 50%; 
  }
  </style>
  