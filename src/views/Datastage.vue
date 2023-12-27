<script setup>
import Menu from '../components/Menu.vue'
import { ref } from 'vue';
import axios from 'axios';

const folio = ref('');
const fechai = ref('');
const fechaf = ref('');
const cargando = ref(false);

const enviar = () => {

    
    const id = sessionStorage.getItem("id");
    const empresa = sessionStorage.getItem("idem");
if(fechai.value > fechaf.value)
{
    alert('La fecha inicial no puede ser posterior a la final, favor de verificar.')
}
else
{
    const formData = new FormData();
    for(let i = 0; i < document.getElementById('nfile').files.length; i++){
          formData.append('file'+i, document.getElementById('nfile').files[i]);
        }
        formData.append('total_zips', document.getElementById('nfile').files.length);
        formData.append('folio', folio.value);
        formData.append('fechai', fechai.value);
        formData.append('fechaf', fechaf.value);
        formData.append('id',id);
        formData.append('empresa',empresa);

        const headers = { 'Content-Type': 'multipart/form-data' };
        axios.post('http://localhost:8000/datastage/guardar/', formData, { headers }).then(async (res) => {
          res.data.files; // binary representation of the file
          res.status; // HTTP status
          await fetch(`http://localhost:8000/datastage/`).then((r) => (r.json())).then((data) =>{
    items.value = data;
  });

          cargando.value = false;
        });
}
}



</script>
<template>
    <div class="flex flex-col">
    <Menu />
    <div class="flex flex-col w-5/6 mx-auto">
        <span class="text-xl font-semibold mt-20">Subir Datastage</span>
  <form @submit.prevent="enviar" class="flex flex-col w-4/6">
  <div class="flex flex-row mt-7">
    <label class="my-auto font-semibold w-1/6">Folio: </label>
    <input v-model="folio" class="border w-4/6 border-slate-700 rounded-sm p-1" maxlength="25" type="text" required />
  </div>
  <div class="flex flex-row mt-7">
    <label class="my-auto font-semibold w-1/6">Fecha inicial: </label>
    <input v-model="fechai" class="border w-4/6 border-slate-700 rounded-sm p-1" type="date" required />
  </div>
  <div class="flex flex-row mt-7">
    <label class="my-auto font-semibold w-1/6">Fecha final: </label>
    <input v-model="fechaf" class="border w-4/6 border-slate-700 rounded-sm p-1" type="date" required />
  </div>
  <div class="flex flex-row">
    <label class="my-auto font-semibold  w-1/6">Archivos: </label>
    <div class="flex flex-col">
        <input class="mt-6" id="nfile" type="file" required ref="file" multiple accept=".zip" />
        <span class="text-sm mt-3">* Puede seleccionar varios archivos en formato .zip</span>
    </div>
    
  </div>
  
  <input type="submit" class="mt-7 text-white mb-10 hover:cursor-pointer w-[175px] h-8 rounded-md hover:bg-teal-600 p-1 bg-teal-500" value="Cargar"/>
  </form>

    </div>
</div>
</template>