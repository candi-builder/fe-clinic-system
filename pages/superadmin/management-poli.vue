<script setup lang="ts">
import PoliTable from "@/components/table/PoliManagement.vue";
definePageMeta({
  middleware: ["auth", "superadmin"],
});
</script>
<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <!-- Sales overview -->
        <v-col cols="12">
          <PoliTable />
        </v-col>
      </v-row>
    </v-col>

  </v-row>
</template>