<script setup>
import Loading from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import { ref } from 'vue';

const props = defineProps(['active'])
const isLoading = ref(props.active);
const fullPage = ref(true);



const onCancel= ()=> {
              console.log('User cancelled the loader.');
              //because the props is single flow direction, you need to set isLoading status normally.
              isLoading.value = false;
          }
</script>
<template>
    <div class="vld-parent">
        <Loading :active="isLoading" :can-cancel="true" :on-cancel="onCancel" color="#007BFF" is-full-page="fullPage">
        </Loading>
       
    </div>
</template>
