<script setup lang="ts">
import { PassienResponse } from "@/types/passien";
import axios from "axios";
const listPassien = ref<PassienResponse[]>([]);
const chipColor = (status: string): string => {
  if (status == "WAITING") {
    return "warning";
  }
  if (status == "CHECKING") {
    return "success";
  }
  return "primary";
};
const config = useRuntimeConfig();
const baseUrl = config.public.baseUrl;
const doctorId = getUserSession();
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
onMounted(() => {
  getListAntrian();
});
</script>
<template>
  <v-card elevation="10" class="">
    <v-card-item class="pa-6">
      <v-card-title class="text-h5 pt-sm-2 pb-7"
        >List Antrian Passien</v-card-title
      >
      <v-table class="month-table">
        <thead>
          <tr class="bg-primary">
            <th class="text-subtitle-1 font-weight-bold">nomor bpjs</th>
            <th class="text-subtitle-1 font-weight-bold">nama passien</th>
            <th class="text-subtitle-1 font-weight-bold">dokter</th>
            <th class="text-subtitle-1 font-weight-bold">poli</th>
            <th class="text-subtitle-1 font-weight-bold">status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="listPassien.length < 1">
            <td colspan="5">
              <p class="text-15 font-weight-medium text-center">Belum ada antrian</p>
            </td>
          </tr>
          <tr
            v-else
            v-for="item in listPassien"
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
          </tr>
        </tbody>
      </v-table>
    </v-card-item>
  </v-card>
</template>
