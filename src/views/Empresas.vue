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
import Menu from '../components/Menu.vue'

const nombre = ref('');
const rfc = ref('');
const inmex = ref('');
const direccion = ref('');
const router = useRouter();
const empresas = ref([]);
const empresas_filtrar = ref([]);
const enabled = ref(true)


const actid = ref('');
const actrfc = ref('');
const actinmex = ref('');
const actdireccion = ref('');
const actnombre = ref('');
const isOpen = ref(false);
const isOpen1 = ref(false);

const editar = (id) =>{
  empresas_filtrar.value = empresas.value;
  const nfiltro = empresas_filtrar.value.filter((elemento) => {
    return elemento._id == id;
  })
  actid.value = id;
  actnombre.value = nfiltro[0].nombre;
  actrfc.value = nfiltro[0].rfc;
  actinmex.value = nfiltro[0].inmex;
  actdireccion.value = nfiltro[0].direccion;
  isOpen.value = true;
  enabled.value = nfiltro[0].activo;
} 

const headers = [
  { text: "ID", value: "_id", width: 50 },
  { text: "Nombre", value: "nombre"},
  { text: "RFC", value: "rfc"},
  { text: "Inmex", value: "inmex"},
  { text: "Dirección", value: "direccion"},
  { text: "Activo", value: "activo"},
  { text: "Opciones", value: "opciones"},
];


onBeforeMount(async function (){

  const log = sessionStorage.getItem('id');
    if(log == '' || log == null)
    {
      router.push('/');
    }
    else{
      await fetch(`http://localhost:8000/empresas/`).then((r) => (r.json())).then((data) =>{
    empresas.value = data;
  });
    }

  


})

const enviar = () =>{
  if(rfc.value.trim() == '')
  {
    alert('El RFC no puede ser de espacios en blanco.')
  }
  else
  {
    axios.post('http://localhost:8000/empresas/guardar/',{
      inmex: inmex.value,
      direccion: direccion.value,
      nombre: nombre.value,
      rfc: rfc.value
    }
    )
    .then(function (response){
      if(response.data == 'noresponse')
      {
        alert('Su empresa, no se pudo registrar intente nuevamente.');
      }
      else
      {
        location.reload();
      }
    })
  }
}

const actualizar = () =>{
  axios.post('http://localhost:8000/empresas/actualizar/',{
      id: actid.value,
      nombre: actnombre.value,
      rfc: actrfc.value,
      inmex: actinmex.value,
      direccion: actdireccion.value,
      activo: enabled.value
    }
    )
    .then(function (response){
      location.reload();
    })
}




const eliminar = (id) =>{

isOpen1.value = true;
actid.value = id;
}

const eliminar_def = (id) =>{
  axios.post('http://localhost:8000/empresas/eliminar/',{
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
  sessionStorage.removeItem('id');
  sessionStorage.removeItem('idem');
  router.push('/');
}
</script>
<template>
  <div class="flex flex-col">
    <Menu />

<div class="flex flex-col">
  <TabGroup>
    <TabList>
      <div class="w-4/6 mx-auto mt-5">
      <Tab as="template" v-slot="{ selected }">
        <button
          :class="{ 'bg-blue-500 rounded-sm text-white mr-2 p-2': selected, 'bg-white text-black mr-2 p-2': !selected }"
        >
          Listar empresas
        </button>
      </Tab>
      <Tab as="template" v-slot="{ selected }">
        <button
          :class="{ 'bg-blue-500 rounded-sm text-white mr-2 p-2': selected, 'bg-white text-black mr-2 p-2': !selected }"
        >
          Registrar empresa
        </button>
      </Tab>
      
    </div>
    </TabList>

    <TabPanels>
      <TabPanel>
        <div class="w-4/6 mx-auto mt-10">
          <span class="text-center text-xl mt-12 font-semibold  text-slate-800">Empresas registradas</span>
          <div class="mt-3">
            <EasyDataTable
            buttons-pagination
            table-class-name="configurar_ev"
            :rows-per-page="10"
    :headers="headers"
    :items="empresas"
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
    {{ activo.activo == true ? "Activo" : "Inactivo" }}
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
  <span class="text-center text-xl mt-12 font-semibold  text-slate-800">Registrar empresa</span>
  <div class="flex flex-col mt-7">
    <span>Nombre(s):</span>
    <input type="text" maxlength="100" required v-model="nombre" class="border border-teal-500 rounded-sm mt-2 h-12 shadow-sm p-2">
  </div>

  <div class="flex flex-col mt-7">
    <span>RFC:</span>
    <input type="text" maxlength="13" minlength="13" required v-model="rfc" class="border border-teal-500 rounded-sm mt-2 h-12 shadow-sm p-2">
  </div>

  <div class="flex flex-col mt-7">
    <span>Inmex:</span>
    <input type="text" maxlength="100" required v-model="inmex" class="border border-teal-500 rounded-sm mt-2 h-12 shadow-sm p-2">
  </div>

  <div class="flex flex-col mt-7">
    <span>Dirección:</span>
    <input type="text" maxlength="1000" required v-model="direccion" class="border border-teal-500 rounded-sm mt-2 h-12 shadow-sm p-2">
  </div>
  <div class="flex justify-center">
  <input type="submit" class="mt-10 text-white mb-10 w-[175px] h-11 rounded-md hover:bg-teal-600 p-2 bg-teal-500" value="Guardar"/>
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
              <form @submit.prevent="actualizar">
              <div class="mt-2">
                
                <p class="flex flex-col">
                 
                <div class="mt-5 flex flex-col">
                  <span>Nombre:</span>
                  <input type="text" maxlength="100" v-model="actnombre" required class="border border-slate-500 p-2 w-full">
                </div>

                <div class="mt-5 flex flex-col">
                  <span>RFC:</span>
                  <input type="text" maxlength="13" minlength="13" v-model="actrfc" required class="border border-slate-500 p-2 w-full">
                </div>

                <div class="mt-5 flex flex-col">
                  <span>Inmex:</span>
                  <input type="text" maxlength="100" v-model="actinmex" required class="border border-slate-500 p-2 w-full">
                </div>

                <div class="mt-5 flex flex-col">
                  <span>Dirección:</span>
                  <input type="text" maxlength="255" required v-model="actdireccion" class="border border-slate-500 p-2 w-full">
                </div>
  <div class="py-5 flex flex-col">
    <span class="mb-3">Activo:</span>
    <Switch
      v-model="enabled"
      :class="enabled ? 'bg-teal-500' : 'bg-teal-900'"
      class="relative inline-flex h-[22px] w-[57px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
    >
      <span class="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        :class="enabled ? 'translate-x-9' : 'translate-x-0'"
        class="pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
      />
    </Switch>
  </div>


               
                </p>
              </div>
              <div class="mt-6 flex justify-around">
                <input
                  type="submit"
                  value="Guardar"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"/>     
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                  Cerrar
                </button>
              </div>
              </form>
              
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
                Esta por eliminar a la empresa con id: {{ actid }}
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