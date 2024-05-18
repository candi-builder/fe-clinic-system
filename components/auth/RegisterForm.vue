<script setup lang="ts">
import { ref } from "vue";
import Camera from "simple-vue-camera";
import axios from "axios";

const isCameraOn = ref(false);
const capturedImage = ref<string | null>(null);
const isLoading = ref<boolean>(false);
const baseUrl: string | undefined = "http://localhost:8000/api";
const registerPassein = reactive({
  nomor_bpjs: "",
  nama_passien: "",
  tanggal_lahir: "",
  alamat: "",
  faskes_tingkat_satu: "",
  poli_id: 0,
  status: "menunggu",
});

const handleCamera = () => {
  isCameraOn.value = !isCameraOn.value;
};
async function takePhoto(photo: string) {
  capturedImage.value = photo;
  isCameraOn.value = false;
  console.log(photo);
  console.log("clicked");
}

const snackbarVisible = ref(false);
const snackbarText = ref<string>("");

const isBtnDisabled = computed(() => {
  return (
    !registerPassein.nomor_bpjs ||
    !registerPassein.nama_passien ||
    !registerPassein.tanggal_lahir ||
    !registerPassein.alamat ||
    !registerPassein.faskes_tingkat_satu ||
    !registerPassein.poli_id ||
    isLoading.value
  );
});
async function postRegisterPassien() {
    snackbarVisible.value = true

  isLoading.value = true;
  await axios
    .post(`${baseUrl}/passien/register-passien`, registerPassein)
    .then(function (response) {
      console.log(response.data.message);
      snackbarText.value = response.data.message
      isLoading.value = false;
    })
    .catch(function (error) {
      console.log(error);
      snackbarText.value = error.response.data.message
      isLoading.value = false;
    });
}
</script>

<template>
  <v-row class="d-flex mb-3">
    <MySnackbar
      v-model:modelValue="snackbarVisible"
      :text="snackbarText"
      :timeout="2000"
    ></MySnackbar>
    <v-col cols="12">
      <v-btn color="primary" size="large" block flat @click="handleCamera">
        mulai OCR
      </v-btn>
    </v-col>

    <v-col class="mb-4"  cols="12" v-if="isCameraOn">
      <camera :resolution="{ width: 375, height: 812 }" @snapshot="takePhoto">
      </camera>
      <v-btn  color="primary" @click="snapshot">scan bpjs</v-btn>
    </v-col>

    <v-col cols="12" v-if="capturedImage">
      <h2>Captured Photo:</h2>
      <img
        :src="capturedImage"
        alt="Captured Image"
        style="max-width: 100%; margin-top: 10px"
      />
    </v-col>

    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">Kartu Bpjs</v-label>
      <v-text-field
        type="file"
        variant="outlined"
        hide-details
        color="primary"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">Nomor BPJS</v-label>
      <v-text-field
        v-model="registerPassein.nomor_bpjs"
        variant="outlined"
        hide-details
        color="primary"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">Nama Passien</v-label>
      <v-text-field
        v-model="registerPassein.nama_passien"
        variant="outlined"
        type="email"
        hide-details
        color="primary"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">alamat</v-label>
      <v-text-field
        v-model="registerPassein.alamat"
        variant="outlined"
        type="text"
        hide-details
        color="primary"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">Tanggal Lahir</v-label>
      <v-text-field
        v-model="registerPassein.tanggal_lahir"
        variant="outlined"
        type="date"
        hide-details
        color="primary"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">Faskes Tingkat Satu</v-label>
      <v-text-field
        v-model="registerPassein.faskes_tingkat_satu"
        variant="outlined"
        type="text"
        hide-details
        color="primary"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">Poli</v-label>
      <v-text-field
        :value="registerPassein.poli_id"
        @input="registerPassein.poli_id = parseInt($event.target.value)"
        variant="outlined"
        type="number"
        hide-details
        color="primary"
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-btn
        @click="postRegisterPassien"
        color="primary"
        size="large"
        :disabled="isBtnDisabled"
        :loading="isLoading"
        block
        flat
        >masukan data passien</v-btn
      >
    </v-col>
  </v-row>
</template>
