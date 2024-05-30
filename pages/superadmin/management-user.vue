<script setup lang="ts">
/*Call Components*/
import UserTable from "@/components/table/UserManagement.vue";
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
          <UserTable />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
