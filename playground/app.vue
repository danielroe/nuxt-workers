<script setup lang="ts">
const message = await hi()

const clientSideMessage = ref('')
async function loadClientSideMessage() {
  clientSideMessage.value = 'Client-side message: ' + await hi()
}
</script>

<template>
  <div>
    {{ message }}
    <br>
    <div>
      {{ clientSideMessage }}
    </div>
    <br>
    <button @click="loadClientSideMessage">
      Load client side message
    </button>
  </div>
</template>
