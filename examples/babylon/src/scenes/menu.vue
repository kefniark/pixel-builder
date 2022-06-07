<template>
  <div class="page">
    <!-- Put your logo there -->
    <div>
      <img src="/assets/logo.png" style="width: 40vw" />
    </div>

    <!-- Make your own custom menu -->
    <ul role="menu" aria-label="menu">
      <li
        role="menuitem"
        tabindex="0"
        @keyup.enter="() => submitHandler('/main')"
        @click="() => submitHandler('/main')"
      >
        Start !
      </li>
      <li
        role="menuitem"
        tabindex="0"
        @keyup.enter="() => submitHandler('/menu')"
        @click="() => submitHandler('/menu')"
      >
        Options
      </li>
      <li role="menuitem" tabindex="0" @keyup.enter="() => submitHandler('/')" @click="() => submitHandler('/')">
        Exit
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"

const router = useRouter()
const submitHandler = (route: string) => router.push({ path: route })
</script>

<style lang="sass" scoped>
.page
    width: 100%
    height: 100%
    display: flex
    align-items: center
    justify-content: space-around

    ul
        li
            font-size: 3rem
            line-height: 5rem
            cursor: pointer
            will-change: transform, color
            transition: color 0.5s, transform 0.75s
            transform: scale(1)
            transform-origin: left

            &:hover, &:focus
                color: #bb26eb
                transform: scale(1.25)
</style>
