<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';
import { Switch } from '@headlessui/vue';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

const nombre = ref('');
const apellidos = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();
const usuarios = ref([]);
const usuarios_filtrar = ref([]);
const enabled = ref(false)


const actid = ref('');
const actnombre = ref('');
const actapellidos = ref('');
const actemail = ref('');
const actpass = ref('');
const isOpen = ref(false);
const isOpen1 = ref(false);

const editar = (id) =>{
  usuarios_filtrar.value = usuarios.value;
  const nfiltro = usuarios_filtrar.value.filter((elemento) => {
    return elemento._id == id;
  })
  actnombre.value = nfiltro[0].nombre;
  actapellidos.value = nfiltro[0].apellidos;
  actemail.value = nfiltro[0].email;
  isOpen.value = true;
} 

const headers = [
  { text: "ID", value: "_id", width: 50 },
  { text: "Nombre", value: "nombre"},
  { text: "Apellidos", value: "apellidos"},
  { text: "Email", value: "email"},
  { text: "Activo", value: "activo"},
  { text: "Opciones", value: "opciones"},
];


onBeforeMount(async function (){
  await fetch(`https://auditanexo30-c50565cdd95d.herokuapp.com/list/`).then((r) => (r.json())).then((data) =>{
    usuarios.value = data;
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

const actualizar = () =>{
  
}




const eliminar = (id) =>{

isOpen1.value = true;
actid.value = id;
}

const eliminar_def = (id) =>{
  axios.post('https://auditanexo30-c50565cdd95d.herokuapp.com/eliminar/',{
      id: id
    }
    )
    .then(function (response){
      if(response.data == 'noresponse')
      {
        alert('Sus datos de acceso son incorrectos, favor de verificar.');
      }
      else
      {
        location.reload();
      }
    })
}

function closeModal1() {
  isOpen1.value = false
}

function closeModal() {
  isOpen.value = false
}
function openModal() {
  isOpen.value = true
}

const mover = (lugar) =>{
  router.push('/'+lugar)
}
const salir = () => {
  router.push('/');
}
</script>
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
          <div class="mt-3">
            <EasyDataTable
            buttons-pagination
            table-class-name="configurar_ev"
            :rows-per-page="10"
    :headers="headers"
    :items="usuarios"
    border-cell
    alternating
            rowsPerPageMessage="Registros por página"
		        rowsOfPageSeparatorMessage="de"
            emptyMessage="No hay registros que mostrar"
  >
  <template #item-_id="_id">
    {{ _id._id }}
  </template>
  <template #item-activo="activo">
    {{ activo.activo == "True" ? "Activo" : "Inactivo" }}
  </template>
  <template #item-opciones="_id" class="flex flex-col">
  <div class="hover:cursor-pointer text-center hover:text-sky-700" @click="editar(_id._id)">Editar</div>
  <div class="mt-1 hover:cursor-pointer text-center hover:text-sky-700" @click="eliminar(_id._id)">Eliminar</div>
  </template>
  </EasyDataTable>
          </div>
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

  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-1/2 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                Editar usuario
              </DialogTitle>
              <div class="mt-2">
                <p class="flex flex-col">
                  <form @submit.prevent="actualizar">
                <div class="mt-5 flex flex-col">
                  <span>Nombre:</span>
                  <input type="text" maxlength="100" v-model="actnombre" class="border border-slate-500 p-2 w-full">
                </div>

                <div class="mt-5 flex flex-col">
                  <span>Apellidos:</span>
                  <input type="text" maxlength="100" v-model="actapellidos" class="border border-slate-500 p-2 w-full">
                </div>

                <div class="mt-5 flex flex-col">
                  <span>Email:</span>
                  <input type="text" maxlength="100" v-model="actemail" class="border border-slate-500 p-2 w-full">
                </div>

                <div class="mt-5 flex flex-col">
                  <span>Nueva contraseña:</span>
                  <input type="text" minlength="6" maxlength="12" v-model="actpass" class="border border-slate-500 p-2 w-full">
                </div>
                <template>
  <div class="py-16">
    <Switch
      v-model="enabled"
      :class="enabled ? 'bg-teal-900' : 'bg-teal-700'"
      class="relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
    >
      <span class="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        :class="enabled ? 'translate-x-9' : 'translate-x-0'"
        class="pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
      />
    </Switch>
  </div>
</template>

                </form>
                </p>
              </div>

              <div class="mt-6 flex justify-around">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                  Cerrar
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <TransitionRoot appear :show="isOpen1" as="template">
    <Dialog as="div" @close="closeModal1" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                Confirmar eliminación
              </DialogTitle>
              <div class="mt-4 flex flex-col">
                <p class="text-md font-semibold">
                Esta por eliminar al usuario con id: {{ actid }}
                </p>
                <span class="mt-6">¿Desea continuar?</span> 
              </div>

              <div class="mt-4 flex flex-row justify-around">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-teal-400 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="eliminar_def(actid)"
                >
                  Continuar
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="closeModal1"
                >
                  Cancelar
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

</template>
<style>
.configurar_ev {
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 50px;
  --easy-table-header-background-color: #544C4E;
  --easy-table-header-font-color: white;
}
</style>