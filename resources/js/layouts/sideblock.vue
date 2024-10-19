<script setup>

const links = ref([
  {
    type: 'link',
    label: 'Dashboard',
    icon: 'lucide:grid',
    to: '/app',
  },
   {
    type: 'link',
    label: 'Dashboard',
    icon: 'lucide:grid',
    to: '/app',
  },
])
</script>

<template>
  <SideblockLayout
    :links
    open-on-mounted
    size="large"
  >
    <slot />

    <template #logo>
      <h3 class="is-hidden-mobile ml-2">
        My app
      </h3>
    </template>

    <template #toolbar>
      <div class="toolbar-link">
        <VDarkmodeToggle />
      </div>
    </template>
  </SideblockLayout>
</template>
