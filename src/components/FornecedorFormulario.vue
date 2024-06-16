<template>
    <div class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Formulário</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="input1" class="form-label">Campo 1</label>
                <input type="text" class="form-control" id="input1">
              </div>
              <div class="mb-3">
                <label for="input2" class="form-label">Campo 2</label>
                <input type="text" class="form-control" id="input2">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">Fechar</button>
            <button type="button" class="btn btn-primary" @click="salvarFornecedor">Salvar mudanças</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script>
import {defineComponent} from 'vue';
import apiFornecedores from '@/service/ApiFornecedorGrid.js';

export default defineComponent({
    name: 'FornecedorFormulario',
    setup(props, {emit}) {
        
        const salvarFornecedor = () => {
            emit('save');
        }

        return{
            salvarFornecedor
        }
    }
})
</script>
  
<style scoped>
  .modal {
    background: rgba(0, 0, 0, 0.5);
  }
  
  .modal-dialog {
    max-width: 1280px;
    width: 100%;
  }
  
  .modal-content {
    width: 100%;
    height: 720px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    position: relative;
  }
</style>
  