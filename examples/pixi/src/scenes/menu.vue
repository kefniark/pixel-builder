<template>
  <div class="page">
    <div>{{ $t("message") }}</div>
    <div>&nbsp;</div>
    <div style="pointer-events: all">
      <label>
        <input
          ref="input"
          type="radio"
          class="nes-radio"
          v-model="checked"
          value="main"
          checked
          @keyup.enter="submitHandler"
        />
        <span @click="submitHandler">Start !</span>
      </label>

      <label>
        <input type="radio" class="nes-radio" v-model="checked" value="option" @keyup.enter="submitHandler" />
        <span @click="submitHandler">Options</span>
      </label>

      <label>
        <input type="radio" class="nes-radio" v-model="checked" value="exit" @keyup.enter="submitHandler" />
        <span @click="submitHandler">Exit</span>
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
const checked = ref("main")

// force focus on first element
const input = ref<HTMLElement | null>(null)
onMounted(() => input.value?.focus())

// validate menu
const router = useRouter()
function submitHandler() {
  console.log("submit", checked.value)
  router.push({ path: checked.value })
}
</script>

<style lang="sass" scoped>
.page
    width: 100%
    height: 100%
    display: flex
    align-items: center
    justify-content: space-between

label
    display: block
    font-size: 100%
</style>
