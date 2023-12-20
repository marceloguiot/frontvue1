<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';
import Loader from '../components/Loader.vue';


const router = useRouter();

const cargando = ref(false);

const items = ref([]);

const descripcion = ref('')

onBeforeMount(async function (){
  await fetch(`http://localhost:8000/orders/getanexo/`).then((r) => (r.json())).then((data) =>{
    items.value = data;
  });


})

const headers = [
  { text: "ID", value: "_id", width: 50 },
  { text: "Descripcion", value: "descripcion"},
  { text: "Fecha", value: "fecha"},
  { text: "Descarga", value: "descargo"},
  { text: "Estatus", value: "inventario"},
];

const enviar = () =>{
  cargando.value = true;
  const formData = new FormData();
  const id = sessionStorage.getItem("id");
        formData.append('file', document.getElementById('nfile').files[0]);
        formData.append('file1', document.getElementById('nfile1').files[0]);
        formData.append('desc',descripcion.value);
        formData.append('id',id);
        console.log(document.getElementById('nfile').files[0]);
        const headers = { 'Content-Type': 'multipart/form-data' };
        axios.post('http://localhost:8000/orders/anexo/', formData, { headers }).then(async (res) => {
          res.data.files; // binary representation of the file
          res.status; // HTTP status
          await fetch(`http://localhost:8000/orders/getanexo/`).then((r) => (r.json())).then((data) =>{
    items.value = data;
  });
          cargando.value = false;
        });
}

const mover = (ruta) =>{
  router.push('/'+ruta);
}

const salir = () => {
  router.push('/');
}

</script>
<template>
  <div class="flex flex-col">
    <nav class="flex items-center justify-between flex-wrap bg-teal-500 p-6">
  <div class="flex items-center flex-shrink-0 text-white mr-6">
    <span @click="mover('dashboard')" class="hover:cursor-pointer font-semibold text-xl tracking-tight">Auditanexo30</span>
  </div>
  <div class="block lg:hidden">
    <button class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
      <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
    </button>
  </div>
  <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
    <div class="text-sm lg:flex-grow">
      <span @click="mover('users')" class="hover:cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
        Usuarios
      </span>
      <span @click="mover('anexo30')" class="hover:cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
        Anexo 30
      </span>
      <span class="hover:cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
        Procesos
      </span>
    </div>
    <div>
      <span @click="salir" class="hover:cursor-pointer inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Cerrar sesión</span>
    </div>

  </div>
</nav>
  <div class="flex flex-col w-5/6 mx-auto">
    
  <span class="text-xl font-semibold mt-20">Subir Anexo 30</span>
  <form @submit.prevent="enviar" class="flex flex-col w-4/6">
  <div class="flex flex-row mt-7">
    <label class="my-auto font-semibold w-1/6">Descripción: </label>
    <input v-model="descripcion" class="border w-4/6 border-slate-700 rounded-sm p-1" maxlength="250" type="text" required />
  </div>
  <div class="flex flex-row">
    <label class="my-auto font-semibold  w-1/6">Inventario Inicial: </label>
    <div class="flex flex-col">
      <!-- <input class="mt-6" id="nfile" type="file" ref="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />-->
      <input class="mt-6" id="nfile" type="file" ref="file" accept=".zip" />
        <span class="text-sm mt-3">* Solo se aceptan archivos .ZIP</span>
    </div>
    
  </div>

  <div class="flex flex-row">
    <label class="my-auto font-semibold  w-1/6">Descargo: </label>
    <div class="flex flex-col">
      <input class="mt-5" id="nfile1" type="file" ref="file" accept="text/plain" />
      <span class="text-sm mt-3">* Solo se aceptan archivos TXT</span>
    </div>
    
  </div>
  
  <input type="submit" class="mt-7 text-white mb-10 hover:cursor-pointer w-[175px] h-8 rounded-md hover:bg-teal-600 p-1 bg-teal-500" value="Cargar"/>
  </form>
  <Loader :key="cargando" :active="cargando" />
  <EasyDataTable
            buttons-pagination
            table-class-name="configurar_ev"
            :rows-per-page="10"
    :headers="headers"
    :items="items"
    border-cell
    alternating
            rowsPerPageMessage="Registros por página"
		        rowsOfPageSeparatorMessage="de"
            emptyMessage="No hay registros que mostrar"
  >
  <template #item-_id="_id">
    {{ _id._id }}
  </template>

  <template #item-descargo="descargo, inventario">
 <span>{{ descargo.descargo }}</span>
 <span class="ml-5">{{ descargo.inventario }}</span>
  </template>

  <template #item-inventario="descargo">
 <span>{{ descargo.descargo !== '' ? 'Descargo cargado' : 'Descargo no cargado'}}</span>
 <span class="ml-5">{{ descargo.inventario !== '' ? 'Inventario cargado' : 'Inventario no cargado' }}</span>
  </template>


  </EasyDataTable>
  </div>
  </div>
</template>