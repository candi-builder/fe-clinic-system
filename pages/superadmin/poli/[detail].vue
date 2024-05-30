<script setup lang="ts">
const route = useRoute();
console.log(route.params.id);
</script>
<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <p>{{ route.params.detail }}</p>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
