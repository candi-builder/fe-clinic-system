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
const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      videoRef.value.play();
    }
  } catch (error) {
    console.error("Error accessing camera: ", error);
  }
}
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
    value: parseInt(poli.id, 10),
  }));
}
async function captureImage() {
  if (!videoRef.value || !canvasRef.value) return;

  const context = canvasRef.value.getContext("2d");
  if (context) {
    context.drawImage(
      videoRef.value,
      0,
      0,
      canvasRef.value.width,
      canvasRef.value.height
    );
    const dataURL = canvasRef.value.toDataURL("image/png");

    // Convert dataURL to Blob and then to File
    const blob = dataURLToBlob(dataURL);
    const file = new File([blob], "capture.png", { type: "image/png" });

    useOcr(file);
  }
}
function dataURLToBlob(dataURL: string) {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

//scan bpjs feature
const apiOcrScan = "http://localhost:8000/scan";
const imageToScan = reactive({
  file: [],
});

async function useOcr(imageBlob: Blob) {
  isLoading.value = true;
  const formData = new FormData();
  formData.append("file", imageBlob);

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

function cameraTogle() {
  isCameraOn.value = !isCameraOn.value;
  if (isCameraOn.value) {
    startCamera();
  }
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
      <v-btn color="primary" size="large" block flat @click="cameraTogle">
        {{ isCameraOn?  'Close Camera' : 'Open Camera' }}
      </v-btn>
    </v-col>
    <v-col v-show="isCameraOn" cols="12">
      <video ref="videoRef" width="400" height="300"></video>
      <canvas
        ref="canvasRef"
        width="400"
        height="300"
        style="display: none"
      ></canvas>
      <v-btn :loading="isLoading" color="primary" @click="captureImage"
        >Scan</v-btn
      >
    </v-col>
    <!-- <v-col class="mb-4" cols="12" v-if="isCameraOn">
      <camera :resolution="{ width: 375, height: 812 }" @snapshot="takePhoto">
      </camera>
      <v-btn color="primary" @click="takePhoto">scan bpjs</v-btn>
    </v-col> -->

    <!-- <v-col cols="12" v-if="capturedImage">
      <h2>Captured Photo:</h2>
      <img
        :src="capturedImage"
        alt="Captured Image"
        style="max-width: 100%; margin-top: 10px"
      />
    </v-col> -->

    <!-- <v-col cols="12">
      <v-file-input
        v-model="imageToScan.file"
        label="file kartu"
        variant="outlined"
        color="primary"
        accept="image/*"
        prepend-icon="mdi-camera"
      ></v-file-input>
      <v-btn :loading="isLoading" color="primary" @click="useOcr">Scan</v-btn>
    </v-col> -->
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
