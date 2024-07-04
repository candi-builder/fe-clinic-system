<script setup lang="ts">
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

const isBpjsTypeKis = ref<boolean>(true)
  const previewImage = ref<string>("");
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
  alamat: null as string | null,
  faskes_tingkat_satu: "",
  poli_id: null as number | null,
  status: "menunggu",
  kelas_rawat:null as string | null,
  nik:null as string | null
});




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
    previewImage.value = dataURL
    // Convert dataURL to Blob and then to File
    // const blob = dataURLToBlob(dataURL);
    // const file = new File([blob], "capture.png", { type: "image/png" });

    useOcr();
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
const apiOcrScanKis = "http://localhost:8000/scan-kis-gemini";
const apiOcrScanBpjs = "http://localhost:8000/scan-bpjs";


async function useOcr() {
  isLoading.value = true;
  if (!previewImage.value) return;
      isLoading.value = true;

      const imageBlob = dataURLToBlob(previewImage.value);
  const formData = new FormData();
  formData.append("file", imageBlob, "capture.png");
  
  try {
    const response = await axios.post( apiOcrScanKis, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const responseOcr = response.data;
    if (isBpjsTypeKis) {
      registerPassein.nomor_bpjs = responseOcr.no_kartu
      registerPassein.nama_passien = responseOcr.nama
      registerPassein.alamat = responseOcr.alamat
      registerPassein.nik = responseOcr.nik
      registerPassein.tanggal_lahir = responseOcr.tanggal_lahir
      registerPassein.faskes_tingkat_satu = responseOcr.faskes
      registerPassein.kelas_rawat =  "..."
    }else{
      
    }
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
      registerPassein.alamat = null;
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
      <h2>Pilih Tipe Kartu</h2>
    </v-col>
    
    <v-col cols="6 " class="d-flex gap-2">
      <v-btn color="primary" class="w-100" size="large" :disabled="isBpjsTypeKis"  @click="isBpjsTypeKis = true">
        KIS
      </v-btn>
  
    </v-col>
    <v-col cols="6 " class="d-flex gap-2">
      <v-btn color="secondary" :disabled="!isBpjsTypeKis" class="w-100" size="large"  @click="isBpjsTypeKis = false">
        BPJS
      </v-btn>
  
    </v-col>  
  
    <v-col cols="12">
      <v-btn color="primary" size="large" block flat @click="cameraTogle">
        {{ isCameraOn?  'Close Camera' : 'Open Camera' }}
      </v-btn>
    </v-col>
    <v-col v-show="isCameraOn" cols="12">
      <video ref="videoRef" width="800" height="500" style="max-width: 100%; height: auto;"></video>
      <canvas ref="canvasRef" width="800" height="500" style="display: none;"></canvas>
      <v-btn :loading="isLoading" color="primary" @click="captureImage"
        >Scan</v-btn
      >
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
    <v-col cols="12" >
      <v-label class="font-weight-bold mb-1" >NIK</v-label>
      <v-text-field
        v-model="registerPassein.nik"
        variant="outlined"
        type="text"
        hide-details
        color="primary"
      ></v-text-field>
    </v-col>
    <v-col cols="12" v-show="isBpjsTypeKis">
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
    <v-col cols="12" v-show="!isBpjsTypeKis">
      <v-label class="font-weight-bold mb-1" >Kelas Rawat</v-label>
      <v-text-field
        v-model="registerPassein.kelas_rawat"
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
