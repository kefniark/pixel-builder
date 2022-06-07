<template>
  <div class="page">
    <div>
      <img src="https://github.com/kefniark/pixel-builder/raw/develop/pixel-builder-banner.gif" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
onMounted(() => {
  setTimeout(() => router.push({ path: "/menu" }), 3000)
})
</script>

<style lang="sass" scoped>
.page
    width: 100%
    height: 100%
    display: flex
    align-items: center
    justify-content: center
    text-align: center
    animation: fadeinout 3s linear forwards

@keyframes fadeinout
  0%,100%
    opacity: 0
  15%,85%
    opacity: 1

label
    display: block
    font-size: 100%
</style>
