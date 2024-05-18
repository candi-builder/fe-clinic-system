<script setup lang="ts">
import { RouterView } from "vue-router";
const title = ref("Klinik islamic");
useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk: any) => {
    return titleChunk ? `${titleChunk} - klinik islamic` : "klinik islamic";
  },
});
</script>

<template>
  <v-locale-provider>
    <v-app>
      <LayoutFullMain />
      <v-main>
        <v-container fluid class="page-wrapper">
          <div class="maxWidth">
            <RouterView />
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
