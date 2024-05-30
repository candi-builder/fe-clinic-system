<script setup lang="ts">
import { PoliResponse } from "@/types/poli";
import axios from "axios";
const listPoli = ref<PoliResponse[]>([]);
const dialog = ref<boolean>(false);
const snackbarVisible = ref(false);
const snackbarText = ref<string>("");
const config = useRuntimeConfig();
const baseUrl = config.public.baseUrl;
const router = useRouter();
const route = useRoute();
const detailParam = route.params.detail
const poliRequest = reactive({
  name:""
})
const currentPoliName = computed(() => {
  return listPoli.value.length > 0 ? listPoli.value[0].poli_name : '';
});
async function getListPoli() {
  try {
    axios
      .get(`${baseUrl}/poli/${detailParam}`)
      .then(function (response) {
        listPoli.value = response.data.data;
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {}
}

async function addPoli() {
  try {
    axios
      .post(`${baseUrl}/poli`,poliRequest)
      .then(function (response) {
        console.log(response.data);
        getListPoli()
        snackbarText.value = "berhasil menambah poli"
        snackbarVisible.value = true
      })
      .catch(function (error) {
        console.log(error);
        snackbarText.value = error
        snackbarVisible.value = true
      });
  } catch (error) {}
} 

async function goToDetail(id:string) {
  router.push(`poli/${id}`)
}
onMounted(()=>{
  getListPoli()
})
</script>
<template>
  <MySnackbar
      v-model:modelValue="snackbarVisible"
      :text="snackbarText"
      :timeout="2000"
    ></MySnackbar>
    <v-card elevation="10" class="">
    <v-card-item class="pa-6">
      <div class="d-flex justify-space-between align-center">
        <v-card-title class="text-h5 pt-sm-2 pb-7">List Member Poli {{currentPoliName}}</v-card-title>
        <v-btn color="success" @click="dialog = true">Tambah poli</v-btn>
      </div>
      <v-table class="month-table">
        <thead>
          <tr class="bg-primary">
            <th class="text-subtitle-1 font-weight-bold">dokter</th>
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
                  {{ item.doctor }}
                </h6>
              </div>
            </td>
           
            <td class="d-flex gap-2">
              <v-btn @click="goToDetail(item.id)" color="primary">Delete</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-dialog v-model="dialog" width="500">
        <v-card prepend-icon="mdi-dock-top" title="data pegawai">
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="poliRequest.name"
                  color="deep-purple"
                  type="text"
                  label="nama poli"
                  variant="outlined"
                ></v-text-field>
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
              @click="addPoli()"
              >kirim</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-item>
  </v-card>
</template>