<template>
  <div class="layout">
    <router-view />
  </div>
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
  background: #111

#app
  width: 100%
  min-height: 100vh
  display: flex
  align-items: center
  justify-content: center

.layout
  z-index: 1
  position: relative

  // scaling
  width: 100vw
  aspect-ratio: 1280/720
  @media (min-aspect-ratio: 1280/720)
    width: auto
    height: 100vh

  // background
  background: url(/assets/background.png)
  background-repeat: no-repeat
  background-size: cover
  pointer-events: none
</style>
