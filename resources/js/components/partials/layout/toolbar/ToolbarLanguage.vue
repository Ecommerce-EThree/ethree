<script setup lang="ts">
const panels = usePanels()

const localFlagSrc = computed(() => {

      return '/images/icons/flags/united-states-of-america.svg'
  
})
</script>

<template>
  <a
    tabindex="0"
    role="button"
    class="toolbar-link right-panel-trigger"
    @keydown.enter.prevent="panels.setActive('languages')"
    @click="panels.setActive('languages')"
  >
    <img
      :src="localFlagSrc"
      alt=""
      width="24"
      height="24"
    >
  </a>
</template>
