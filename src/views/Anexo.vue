<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';
import Loader from '../components/Loader.vue';
import Empresa from '../components/Empresa.vue';
import Menu from '../components/Menu.vue'


const router = useRouter();

const cargando = ref(false);
const sempresa = ref(false);

const items = ref([]);

const descripcion = ref('')

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
    else
    {
      await fetch(`http://localhost:8000/orders/getanexo`).then((r) => (r.json())).then((data) =>{
    items.value = data;
  });

    }
    
    }
  


})

const headers = [
  { text: "ID", value: "_id", width: 50 },
  { text: "Descripcion", value: "descripcion"},
  { text: "Fecha", value: "fecha"},
  { text: "Descarga", value: "descargo"},
  { text: "Estatus", value: "inventario"},
  { text: "Opciones", value: "opcion"},
];

const enviar = () =>{
  cargando.value = true;
  const formData = new FormData();
  const id = sessionStorage.getItem("id");
  const empresa = sessionStorage.getItem("idem");
        for(let i = 0; i < document.getElementById('nfile').files.length; i++){
          formData.append('file'+i, document.getElementById('nfile').files[i]);
        }
        formData.append('total_A', document.getElementById('nfile').files.length);
        formData.append('total_B', document.getElementById('nfile1').files.length);
        formData.append('empresa', empresa);

       
        for(let i = 0; i < document.getElementById('nfile1').files.length; i++){
          formData.append('fileb'+i, document.getElementById('nfile1').files[i]);
        }
       
       
        formData.append('desc',descripcion.value);
        formData.append('id',id);
        console.log(document.getElementById('nfile').files[0]);
        const headers = { 'Content-Type': 'multipart/form-data' };
        axios.post('http://localhost:8000/orders/anexo/', formData, { headers }).then(async (res) => {
          res.data.files; // binary representation of the file
          res.status; // HTTP status
          await fetch(`http://localhost:8000/orders/getanexo`).then((r) => (r.json())).then((data) =>{
    items.value = data;
  });

          cargando.value = false;
        });
}

const mover = (ruta) =>{
  router.push('/'+ruta);
}



const eliminar = (id) => {
  cargando.value = true;
  const formData = new FormData();
  const logemp = sessionStorage.getItem('idem');
  formData.append('id',id);
  axios.post('http://localhost:8000/orders/eliminar/', formData, { headers }).then(async (res) => {
    await fetch(`http://localhost:8000/orders/getanexo`).then((r) => (r.json())).then((data) =>{
    items.value = data;
  });

          cargando.value = false;
        });

}

</script>
<template>
  <div class="flex flex-col">
    <Menu />
  <div class="flex flex-col w-5/6 mx-auto">
    
  <span class="text-xl font-semibold mt-20">Subir Anexo 30</span>
  <form @submit.prevent="enviar" class="flex flex-col w-4/6">
  <div class="flex flex-row mt-7">
    <label class="my-auto font-semibold w-1/6">Descripción: </label>
    <input v-model="descripcion" class="border w-4/6 border-slate-700 rounded-sm p-1" maxlength="250" type="text" required />
  </div>
  <div class="flex flex-row">
    <label class="my-auto font-semibold  w-1/6">Descargo: </label>
    <div class="flex flex-col">
      <!-- <input class="mt-6" id="nfile" type="file" ref="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />-->
      <input class="mt-6" id="nfile" type="file" ref="file" multiple />
        <span class="text-sm mt-3">* Puede seleccionar varios archivos</span>
    </div>
    
  </div>

  <div class="flex flex-row">
    <label class="my-auto font-semibold  w-1/6">Inventario Inicial: </label>
    <div class="flex flex-col">
      <input class="mt-5" id="nfile1" type="file" ref="file" multiple/>
      <span class="text-sm mt-3">* Puede seleccionar varios archivos</span>
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
    <div class="flex flex-row justify-between">
      <div class="flex flex-col">
 <span v-for="item in descargo.descargo">{{ item.nombre }}</span>
</div>
<div class="flex flex-col">
  <span v-for="item in descargo.inventario">{{ item.nombre }}</span>
</div>
</div>
  </template>

  <template #item-opcion="_id" class="flex items-center">
    <span @click="eliminar(_id._id)" class="hover:cursor-pointer hover:text-sky-600">Eliminar</span>
  </template>

  <template #item-inventario="descargo">
    <div class="flex flex-row justify-between">
 <span>{{ descargo.descargo !== '' ? 'Descargo cargado' : 'Descargo no cargado'}}</span>
 <span class="ml-5">{{ descargo.inventario !== '' ? 'Inventario cargado' : 'Inventario no cargado' }}</span>
</div>
  </template>


  </EasyDataTable>
  </div>
  </div>
  <Empresa :active="sempresa" />
</template>