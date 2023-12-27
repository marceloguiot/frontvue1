<template>
  <div class="flex flex-col">
    <Menu />
<div class="flex flex-col">
    <span class="text-2xl font-semibold mx-auto mt-20">Alertas</span>
  </div>
  </div>
  <Empresa :active="sempresa" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import axios from 'axios'
import Empresa from '../components/Empresa.vue'
import Menu from '../components/Menu.vue'


const router = useRouter();

const sempresa = ref(false);

onBeforeMount(async function (){
    const log = sessionStorage.getItem('id');
    if(log == '' || log == null)
    {
      router.push('/');
    }
    else{
    const logemp = sessionStorage.getItem('idem');
    if(logemp == '' || logemp == null)
    {
      sempresa.value = true;
    }
    }
  });




const mover = (ruta) =>{
  router.push('/'+ruta);
}

const salir = () => {
  sessionStorage.removeItem('id');
  sessionStorage.removeItem('idem');
  router.push('/');
}
</script>
