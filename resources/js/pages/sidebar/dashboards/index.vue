<script setup lang="ts">

const pageTitle = useVueroContext<string>('page-title')

useHead(() => ({
  title: `Sidebar - Vuero`,
}))
</script>

<template>
  <PersonalDashboardV1 />
</template>
