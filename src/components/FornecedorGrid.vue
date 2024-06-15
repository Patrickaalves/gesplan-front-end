<template>
    <div>
        {{fornecedores.content}}
    </div>
</template>

<script>
    import { ref, defineComponent } from 'vue';
    import api from '@/service/ApiFornecedorGrid.js';

    export default defineComponent({
    setup() {
        const fornecedores = ref([]);


        const fetchFornecedores = () => {
        api.getCadastros()
            .then(response => {
                fornecedores.value = response.data;
            })
            .catch(error => {
                console.error('Erro ao buscar fornecedores:', error);
            });
        };

        fetchFornecedores();

        return {
            fornecedores,
        };
    },
    });
    
</script>
