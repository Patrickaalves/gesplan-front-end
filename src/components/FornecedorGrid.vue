<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <button @click="controleMostrarFuncionarios()" type="button" class="btn btn-success btn-lg m-1">Novo Fornecedor</button>
      <button type="button" :class="{'btn btn-warning m-2': algumaCheckboxSelecionada, 'btn btn-secondary m-2': !algumaCheckboxSelecionada}">
        <i class="bi bi-pencil"></i>
      </button>
      <button @click="deletarFornecedores()" type="button" :class="{'btn btn-danger m-2': algumaCheckboxSelecionada, 'btn btn-secondary m-2': !algumaCheckboxSelecionada}">
        <i class="bi bi-trash"></i>
      </button>
    </nav>
    <FornecedorFormulario v-if="mostrar_formulario" @close="controleMostrarFuncionarios()" @save="controleMostrarFuncionarios(true)" />
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
            <th scope="col"><i class="bi bi-star"></i></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fornecedor in fornecedores.content" :key="fornecedor.id">
            <td><input type="checkbox" v-model="fornecedorSelecionado[fornecedor.id]" /></td>
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
              <i class="bi bi-star-fill" :class="{ 'star-selected': fornecedor.favorito }"
                @click="alternarFavorito(fornecedor)">
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
import { ref, defineComponent, onMounted, watch } from 'vue';
import apiFornecedores from '@/service/ApiFornecedorGrid.js';
import apiFornecedoresTelefone from '@/service/ApiFornecedoresTelefone';

import FornecedorFormulario from '@/components/FornecedorFormulario.vue'

export default defineComponent({

  components: {
    FornecedorFormulario
  },

  setup() {
    const fornecedores = ref(null);
    const telefones = ref({});
    const fornecedorSelecionado = ref({}); // Objeto para controlar checkboxes selecionadas
    const algumaCheckboxSelecionada = ref(false); // Variável para verificar se alguma checkbox está selecionada
    const mostrar_formulario = ref(false)

    // Carregar a grid com os dados dos fornecedores
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

    // Busca os telefones de determinado fornecedor
    const fetchTelefonesFornecedor = (id) => {
      apiFornecedoresTelefone.getTelefones(id)
        .then(response => {
          telefones.value[id] = response.data;
        })
        .catch(error => {
          console.error('Erro ao buscar telefones do fornecedor:', error);
        });
    };

    // Alternar o favorito tanto na aplicacao quanto no banco de dados
    const alternarFavorito = (fornecedor) => {
      fornecedor.favorito = !fornecedor.favorito;
      apiFornecedores.updateFornecedor(fornecedor)
        .then(response => {
          fetchFornecedores()
        })
        .catch(error => {
          console.error('Erro ao atualizar fornecedor:', error);
        });
    };

    // Verificar se alguma checkbox está selecionada
    const verificarAlgumaSelecionada = () => {
      for (let key in fornecedorSelecionado.value) {
        if (fornecedorSelecionado.value[key]) {
          algumaCheckboxSelecionada.value = true;
          return;
        }
      }
      algumaCheckboxSelecionada.value = false;
    };

    const deletarFornecedores = () => {
      Object.keys(fornecedorSelecionado.value).forEach(idFornecedor => {
        if (fornecedorSelecionado.value[idFornecedor]) {
          apiFornecedores.deletarFornecedor(idFornecedor)
            .then(() => {
              // Atualize os fornecedores após a deleção
              fetchFornecedores();
            })
            .catch(error => {
              console.error(`Erro ao deletar fornecedor ${idFornecedor}:`, error);
            });
        }
      });
    };

    // Exibir formulario de cadastro de fornecedores ou fechar o formulario
    const controleMostrarFuncionarios = (prm_salvar) => {
      mostrar_formulario.value = !mostrar_formulario.value
      if(prm_salvar == true){
        fetchFornecedores();
      }
    }

    // Monitorar mudanças nas checkboxes selecionadas
    watch(fornecedorSelecionado, verificarAlgumaSelecionada, { deep: true });

    onMounted(() => {
      fetchFornecedores();
    });

    return {
      fornecedores,
      telefones,
      fornecedorSelecionado,
      algumaCheckboxSelecionada,
      alternarFavorito,
      deletarFornecedores,
      mostrar_formulario,
      controleMostrarFuncionarios
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
