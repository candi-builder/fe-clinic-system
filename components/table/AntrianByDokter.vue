<script setup lang="ts">
import { AntrianResponse } from "@/types/passien";
import axios from "axios";
const listPassien = ref<AntrianResponse[]>([]);
const chipColor = (status: string): string => {
  if (status == "WAITING") {
    return "warning";
  }
  if (status == "CHECKING") {
    return "success";
  }
  return "primary";
};
const dialog = ref<boolean>(false);
const config = useRuntimeConfig();
const baseUrl = config.public.baseUrl;
const doctorId = getUserSession();
const diagnosaRequest = reactive({
  pasien_id: 0,
  keterangan_resep: "",
  hasil_diagnosa: "",
  status: "PICKUP",
  doctor: doctorId?.uuid,
});
async function getListAntrian() {
  try {
    axios
      .get(`${baseUrl}/antrian/pemeriksaan/${doctorId?.uuid}`)
      .then(function (response) {
        listPassien.value = response.data.data;
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {}
}
function cekStatus(status: string): boolean {
  if (status == "WAITING") {
    return false;
  }

  if (status == "CHECKING") {
    return true;
  }

  return true;
}

async function checkPassien(idAntrian: number) {
  axios
    .post(`${baseUrl}/doctor/update-pasien/${idAntrian}`)
    .then(function (response) {
      console.log(response.data);
      getListAntrian();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function openFormDiagnosa(pasien_id: string) {
  dialog.value = true;
  diagnosaRequest.pasien_id = parseInt(pasien_id, 10);
}

async function diagnosaPassien() {
  try {
    axios
      .post(`${baseUrl}/doctor/diagnosa/${diagnosaRequest.pasien_id}`, diagnosaRequest)
      .then(function (response) {
        console.log(response.data);
        getListAntrian();
        dialog.value = false;
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}
onMounted(() => {
  getListAntrian();
});
</script>
<template>
  <v-card elevation="10" class="">
    <v-card-item class="pa-6">
      <v-card-title class="text-h5 pt-sm-2 pb-7"
        >List Antrian Passien Periksa</v-card-title
      >
      <v-table class="month-table">
        <thead>
          <tr class="bg-primary">
            <th class="text-subtitle-1 font-weight-bold">nomor bpjs</th>
            <th class="text-subtitle-1 font-weight-bold">nama passien</th>
            <th class="text-subtitle-1 font-weight-bold">dokter</th>
            <th class="text-subtitle-1 font-weight-bold">poli</th>
            <th class="text-subtitle-1 font-weight-bold">status</th>
            <th class="text-subtitle-1 font-weight-bold">aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="listPassien.length < 1">
            <td colspan="5">
              <p class="text-15 font-weight-medium text-center">
                Belum ada antrian
              </p>
            </td>
          </tr>
          <tr
            v-else
            v-for="(item, index) in listPassien"
            :key="item.nomor_bpjs"
            class="month-item"
          >
            <td>
              <p class="text-15 font-weight-medium">{{ item.nomor_bpjs }}</p>
            </td>
            <td>
              <div class="">
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.nama_passien }}
                </h6>
              </div>
            </td>
            <td>
              <h6 class="text-body-1 text-muted">{{ item.dokter }}</h6>
            </td>
            <td>
              <h6 class="text-body-1 font-weight-bold">{{ item.poli }}</h6>
            </td>
            <td>
              <v-chip
                :class="'text-body-1 bg-' + chipColor(item.status)"
                color="white"
                size="small"
                >{{ item.status }}</v-chip
              >
            </td>
            <td>
              <v-btn
                v-show="!cekStatus(item.status)"
                @click="checkPassien(item.id)"
                :disabled="index !== 0"
                color="primary"
              >
                Periksa
              </v-btn>
              <v-btn
                v-show="cekStatus(item.status)"
                @click="openFormDiagnosa(item.passien_id)"
                :disabled="index !== 0"
                color="primary"
              >
                Buat Diagnosa
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-dialog v-model="dialog" width="500">
        <v-card prepend-icon="mdi-account" title="Diagnosa Passien">
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-textarea
                  v-model="diagnosaRequest.hasil_diagnosa"
                  color="deep-purple"
                  label="hasil diagnosa"
                  rows="4"
                  variant="outlined"
                  auto-grow
                ></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="diagnosaRequest.keterangan_resep"
                  color="deep-purple"
                  label="Resep Obat"
                  rows="4"
                  variant="outlined"
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Close" variant="plain" @click="dialog = false"
              >tutup</v-btn
            >

            <v-btn
              color="primary"
              text="Save"
              variant="tonal"
              @click="diagnosaPassien()"
              >kirim</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-item>
  </v-card>
</template>
