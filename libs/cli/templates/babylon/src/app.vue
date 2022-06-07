<template>
  <div class="layout">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<style lang="sass">
#app
  width: 100%
  min-height: 100vh
  display: flex
  align-items: center
  justify-content: center

.layout
  z-index: 1
  position: relative

  // white border
  box-shadow: inset 0px 0px 5px 1px #ffffff44

  // scaling
  width: 100vw
  aspect-ratio: 1280/720
  @media (min-aspect-ratio: 1280/720)
    width: auto
    height: 100vh
</style>