<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios'


const router = useRouter();
const email = ref('');
const password = ref('');

const enviar = () =>{
  if(password.value.trim() == '')
  {
    alert('La contraseña no puede ser de espacios en blanco.')
  }
  else
  {
    axios.post('https://auditanexo30-c50565cdd95d.herokuapp.com/login/',{
      email: email.value,
      passwrd: password.value
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
</script>

<template>
  <div class="flex flex-col bg-slate-200 h-screen">
  <div class="flex flex-col bg-white max-w-[400px] min-w-[380px] h-auto rounded-lg p-5 shadow-lg m-auto">
<span class="text-center text-2xl font-semibold text-slate-800">Bienvenido</span>
<div class="flex flex-col">
  <form @submit.prevent="enviar">
  <span class="text-center text-xl mt-12 font-semibold  text-slate-800">Iniciar sesión</span>
  <div class="flex flex-col mt-7">
    <span>Correo electrónico:</span>
    <input type="email" required v-model="email" class="border border-teal-500 rounded-sm mt-2 h-12 shadow-sm p-2">
  </div>

  <div class="flex flex-col mt-7">
    <span>Contraseña:</span>
    <input type="password" minlength="6" maxlength="12" required v-model="password" class="border border-teal-500 rounded-sm mt-2 h-12 shadow-sm p-2">
  </div>
  <div class="flex justify-center">
  <input type="submit" class="mt-10 mb-10 w-[175px] h-11 rounded-md hover:bg-teal-400 p-2 bg-teal-300" value="Acceder"/>
  </div>
</form>
</div>
  </div>
</div>
</template>
