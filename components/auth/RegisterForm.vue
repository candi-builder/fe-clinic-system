<script setup lang="ts">
import { ref } from "vue";
import Camera from "simple-vue-camera";
import axios from "axios";
import { PoliResponse, SelectItem } from "@/types/poli";
import { number, string } from "yup";
const isCameraOn = ref(false);
const capturedImage = ref<string | null>(null);
const isLoading = ref<boolean>(false);

const config = useRuntimeConfig();
const baseUrl = config.public.baseUrl;

const selectItem = ref<SelectItem[]>();

//form data registerpassien
const registerPassein = reactive({
  nomor_bpjs: "",
  nama_passien: "",
  tanggal_lahir: "",
  alamat: "",
  faskes_tingkat_satu: "",
  poli_id: null as number | null,
  status: "menunggu",
});

const listPoli = ref<PoliResponse[]>([]);

//handle camera
const handleCamera = () => {
  isCameraOn.value = !isCameraOn.value;
};

async function getListPoli() {
  const responsePoli = await axios.get(`${baseUrl}/poli`);
  listPoli.value = responsePoli.data.data;

  selectItem.value = listPoli.value.map((poli: PoliResponse) => ({
    title: poli.poli_name,
    value: poli.id,
  }));

  console.log("poli", listPoli.value);
  console.log(selectItem.value);
}

//handle take picture
async function takePhoto(photo: string) {
  capturedImage.value = photo;
  isCameraOn.value = false;
  console.log(photo);
  console.log("clicked");
}

//snackbar toogle
const snackbarVisible = ref(false);
const snackbarText = ref<string>("");

//disable button if form data empty
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

//function post register passien
async function postRegisterPassien() {
  snackbarVisible.value = true;

  isLoading.value = true;
  await axios
    .post(`${baseUrl}/passien/register-passien`, registerPassein)
    .then(function (response) {
      console.log(response.data.message);
      snackbarText.value = response.data.message;
      isLoading.value = false;
      console.log(response.data.message);
      snackbarText.value = response.data.message;
      isLoading.value = false;
      registerPassein.nomor_bpjs = "";
      registerPassein.nama_passien = "";
      registerPassein.tanggal_lahir = "";
      registerPassein.alamat = "";
      registerPassein.faskes_tingkat_satu = "";
      registerPassein.poli_id = 0;
      registerPassein.status = "menunggu";
    })
    .catch(function (error) {
      console.log(error);
      snackbarText.value = error.response.data.message;
      isLoading.value = false;
    });
}
onMounted(() => {
  getListPoli();
});
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

    <v-col class="mb-4" cols="12" v-if="isCameraOn">
      <camera :resolution="{ width: 375, height: 812 }" @snapshot="takePhoto">
      </camera>
      <v-btn color="primary" @click="takePhoto">scan bpjs</v-btn>
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
      <v-select
        label="Pilih Poli"
        v-model="registerPassein.poli_id"
        :items="selectItem"
        color="primary"
        item-text="title"
        item-value="value"
        variant="outlined"
        @update:modelValue="onPoliChange"
      ></v-select>
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
