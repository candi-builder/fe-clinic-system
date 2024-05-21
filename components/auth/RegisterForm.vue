<script setup lang="ts">
import Camera from "simple-vue-camera";
import axios from "axios";
import { PoliResponse, SelectItem } from "@/types/poli";
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
//handle camera
const handleCamera = () => {
  isCameraOn.value = !isCameraOn.value;
};

//get list poli for selectitem
const listPoli = ref<PoliResponse[]>([]);

async function getListPoli() {
  const responsePoli = await axios.get(`${baseUrl}/poli/member`);
  listPoli.value = responsePoli.data.data;

  selectItem.value = listPoli.value.map((poli: PoliResponse) => ({
    title: `${poli.poli_name} - ${poli.doctor}`,
    value: poli.id,
  }));
}


//scan bpjs feature
const apiOcrScan = "http://localhost:8000/scan";
const imageToScan = reactive({
  file: [],
});

async function useOcr() {
  if (!imageToScan.file) {
    console.log("No file selected");
    return;
  }

  const formData = new FormData();
  formData.append("file", imageToScan.file[0]);
  isLoading.value = true;
  try {
    const response = await axios.post(apiOcrScan, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const responseOcr = response.data.result;
    let result = [];
    let alamatGabungan = "";
    for (let i = 0; i < responseOcr.length; i++) {
      if (
        responseOcr[i] === "Nomor Kartu" ||
        responseOcr[i] === "Nama" ||
        responseOcr[i] === "Tanggal lahir" ||
        responseOcr[i] === "NIK" ||
        responseOcr[i] === "Faskes Tingkat"
      ) {
        // Push elemen berikutnya ke array baru
        result.push(responseOcr[i + 1]);
      }
      if (responseOcr[i] === "Alamat") {
        let j = i + 1;
        alamatGabungan = responseOcr[j];
        while (
          responseOcr[j + 1] !== "Tanggal lahir" &&
          j < responseOcr.length - 1
        ) {
          j++;
          alamatGabungan += " " + responseOcr[j];
        }
        result.push(alamatGabungan);
        i = j;
      }
    }

    registerPassein.nomor_bpjs = result[0];
    registerPassein.nama_passien = result[1];
    registerPassein.tanggal_lahir = result[3];
    registerPassein.faskes_tingkat_satu = result[6];
    registerPassein.alamat = alamatGabungan;
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;

    console.error("There was an error!", error);
  }
}

//handle take picture
async function takePhoto(photo: string) {
  capturedImage.value = photo;
  isCameraOn.value = false;
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
  registerPassein.poli_id = Number(registerPassein.poli_id);
  await axios
    .post(`${baseUrl}/passien/register-passien`, registerPassein)
    .then(function (response) {
      snackbarVisible.value = true;
      isLoading.value = false;
      snackbarText.value = response.data.message;
      isLoading.value = false;
      registerPassein.nomor_bpjs = "";
      registerPassein.nama_passien = "";
      registerPassein.tanggal_lahir = "";
      registerPassein.alamat = "";
      registerPassein.faskes_tingkat_satu = "";
      registerPassein.status = "WAITING";
    })
    .catch(function (error) {
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
      <v-file-input
        v-model="imageToScan.file"
        label="file kartu"
        variant="outlined"
        color="primary"
        accept="image/*"
        prepend-icon="mdi-camera"
      ></v-file-input>
      <v-btn :loading="isLoading" color="primary" @click="useOcr">Scan</v-btn>
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
