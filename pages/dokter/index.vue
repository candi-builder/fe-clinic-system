<script setup lang="ts">
/*Call Components*/
import AntrianByDokter from "@/components/table/AntrianByDokter.vue";
</script>
<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <!-- Sales overview -->
        <v-col cols="12">
          <AntrianByDokter />
        </v-col>
      </v-row>
    </v-col>
    <v-col class="text-center mt-2">
      <!-- <p class="text-muted">
        Design and Developed by
        <a
          flat
          variant="text"
          href="https://adminmart.com/"
          target="_blank"
          class="pl-1 text-primary"
          >az</a
        >
      </p> -->
    </v-col>
  </v-row>
</template>
