<template>
  <div class="layout">Stuff</div>
</template>

<script lang="ts" setup>
// disable any system right click
document.addEventListener("contextmenu", (event) => event.preventDefault())
</script>

<style lang="sass">
html, body
  padding: 0
  margin: 0
  user-select: none

.layout
  z-index: 1
  position: relative
  background: url(/assets/background.png)
  background-repeat: no-repeat
  background-size: cover
  min-height: 100vh
  pointer-events: none
</style>
