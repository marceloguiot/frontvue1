<template>
  <div class="flex flex-col">
    <nav class="flex items-center justify-between flex-wrap bg-teal-500 p-6">
  <div class="flex items-center flex-shrink-0 text-white mr-6">
    <span  @click="mover('dashboard')" class="hover:cursor-pointer font-semibold text-xl tracking-tight">Auditanexo30</span>
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
      <span class="hover:cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
        Ordenes
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


<div class="flex flex-col">
  <TabGroup>
    <TabList>
      <div class="w-4/6 mx-auto mt-5">
      <Tab as="template" v-slot="{ selected }">
        <button
          :class="{ 'bg-blue-500 rounded-sm text-white mr-2 p-2': selected, 'bg-white text-black mr-2 p-2': !selected }"
        >
          Listar usuarios
        </button>
      </Tab>
      <Tab as="template" v-slot="{ selected }">
        <button
          :class="{ 'bg-blue-500 rounded-sm text-white mr-2 p-2': selected, 'bg-white text-black mr-2 p-2': !selected }"
        >
          Registrar usuarios
        </button>
      </Tab>
      
    </div>
    </TabList>
 
    <TabPanels>
      <TabPanel>
        <div class="w-4/6 mx-auto mt-10">
          <span class="text-center text-xl mt-12 font-semibold  text-slate-800">Lista de usuarios</span>

        </div>
        </TabPanel>
      <TabPanel>
        <form @submit.prevent="enviar" class="w-4/6 mx-auto mt-10">
  <span class="text-center text-xl mt-12 font-semibold  text-slate-800">Registrar usuario</span>
  <div class="flex flex-col mt-7">
    <span>Nombre(s):</span>
    <input type="text" maxlength="100" required v-model="nombre" class="border border-teal-500 rounded-sm mt-2 h-12 shadow-sm p-2">
  </div>

  <div class="flex flex-col mt-7">
    <span>Apellidos:</span>
    <input type="text" maxlength="100" required v-model="apellidos" class="border border-teal-500 rounded-sm mt-2 h-12 shadow-sm p-2">
  </div>

  <div class="flex flex-col mt-7">
    <span>Correo electrónico:</span>
    <input type="email" maxlength="100" required v-model="email" class="border border-teal-500 rounded-sm mt-2 h-12 shadow-sm p-2">
  </div>

  <div class="flex flex-col mt-7">
    <span>Contraseña:</span>
    <input type="text" minlength="6" maxlength="12" required v-model="password" class="border border-teal-500 rounded-sm mt-2 h-12 shadow-sm p-2">
  </div>
  <div class="flex justify-center">
  <input type="submit" class="mt-10 mb-10 w-[175px] h-11 rounded-md hover:bg-teal-400 p-2 bg-teal-300" value="Guardar"/>
  </div>
</form>
      </TabPanel>
    </TabPanels>
  </TabGroup>
  </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';

const nombre = ref('');
const apellidos = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();
const usuarios = ref([]);


onBeforeMount(async function (){
  await fetch(`https://auditanexo30-c50565cdd95d.herokuapp.com/list/`).then((r) => {
    r.json();
  });


})

const enviar = () =>{
  if(password.value.trim() == '')
  {
    alert('La contraseña no puede ser de espacios en blanco.')
  }
  else
  {
    axios.post('https://auditanexo30-c50565cdd95d.herokuapp.com/users/',{
      email: email.value,
      passwrd: password.value,
      nombre: nombre.value,
      apellidos: apellidos.value
    }
    )
    .then(function (response){
      if(response.data == 'noresponse')
      {
        alert('Sus datos de acceso son incorrectos, favor de verificar.');
      }
      else
      {
        router.push('/dashboard');
      }
    })
  }
}


const mover = (lugar) =>{
  router.push('/'+lugar)
}
const salir = () => {
  router.push('/');
}
</script>
