<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "resepsionis"],
  layout: "blank",
});
</script>
<template>
  <div class="authentication">
    <v-container fluid class="pa-3">
      <v-row class="h-100vh d-flex justify-center align-center">
        <v-col cols="12" lg="4" xl="3" class="d-flex align-center">
          <v-card
            rounded="md"
            elevation="10"
            class="px-sm-1 px-0 withbg mx-auto"
            max-width="500"
          >
            <v-card-item class="pa-sm-8">
              <div class="d-flex justify-center py-4">
                <!-- <LayoutFullLogo /> -->
                <v-card-title class="text-h6 text-md-h5 text-lg-h4"
                  >Klinik Islamic Village</v-card-title
                >
              </div>
              <div class="text-body-1 text-muted text-center mb-3">
                Registrasi Passien
              </div>
              <AuthRegisterForm />
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
