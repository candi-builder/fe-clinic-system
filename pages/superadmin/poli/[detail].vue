<script setup lang="ts">
const route = useRoute();
console.log(route.params.id);
import PoliTable from "@/components/table/PoliMember.vue";

</script>
<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <poli-table/>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
