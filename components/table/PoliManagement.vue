<script setup lang="ts">
import { PoliResponse } from "@/types/poli";
import axios from "axios";
const listPoli = ref<PoliResponse[]>([]);

const config = useRuntimeConfig();
const baseUrl = config.public.baseUrl;
async function getListPoli() {
  try {
    axios
      .get(`${baseUrl}/poli`)
      .then(function (response) {
        listPoli.value = response.data.data;
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {}
}

onMounted(()=>{
  getListPoli()
})
</script>
<template>
    <v-card elevation="10" class="">
    <v-card-item class="pa-6">
      <div class="d-flex justify-space-between align-center">
        <v-card-title class="text-h5 pt-sm-2 pb-7">List pegawai</v-card-title>
        <v-btn color="success" @click="openFormAddUser">Tambah poli</v-btn>
      </div>
      <v-table class="month-table">
        <thead>
          <tr class="bg-primary">
            <th class="text-subtitle-1 font-weight-bold">Nama Poli</th>
            <th class="text-subtitle-1 font-weight-bold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="listPoli.length < 1">
            <td colspan="5">
              <p class="text-15 font-weight-medium text-center">
                Belum ada poli
              </p>
            </td>
          </tr>
          <tr
            v-else
            v-for="item in listPoli"
            :key="item.id"
            class="month-item"
          >
            <td>
              <div class="">
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.poli_name }}
                </h6>
              </div>
            </td>
           
            <td class="d-flex gap-2">
              <v-btn  color="primary">Detail</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-item>
  </v-card>
</template>