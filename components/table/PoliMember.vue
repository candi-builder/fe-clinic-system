<script setup lang="ts">
import { PoliResponse, SelectItem } from "@/types/poli";
import { UserResponse } from "~~/types/user";
import axios from "axios";
const listPoli = ref<PoliResponse[]>([]);
const listDoctor = ref<UserResponse[]>([]);
const selectItem = ref<SelectItem[]>();

const dialog = ref<boolean>(false);
const snackbarVisible = ref(false);
const snackbarText = ref<string>("");
const config = useRuntimeConfig();
const baseUrl = config.public.baseUrl;
const router = useRouter();
const route = useRoute();
const detailParam = route.params.detail;
const poliRequest = reactive({
  user_id: "",
});
const currentPoliName = computed(() => {
  return listPoli.value.length > 0 ? listPoli.value[0].poli_name : "";
});
async function getListPoli() {
  try {
    axios
      .get(`${baseUrl}/poli/${detailParam}`)
      .then(function (response) {
        if ( response.data.data == undefined) {
          listPoli.value = []
        }else{
          listPoli.value = response.data.data;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {}
}
async function getListDoctor() {
  try {
    axios
      .get(`${baseUrl}/users`)
      .then(function (response) {
        listDoctor.value = listDoctor.value = response.data.data.filter(
          (user: UserResponse) => user.role === "DOKTER"
        );
        selectItem.value = listDoctor.value.map((user: UserResponse) => ({
          title: `${user.fullname}`,
          value: user.uuid,
        }));
        console.log(listDoctor);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {}
}

async function addPoli() {
  console.log(detailParam);
  
  try {
    axios
      .post(`${baseUrl}/poli/add-member/${detailParam}`, poliRequest)
      .then(function (response) {
        console.log(response.data);
        getListPoli();
        snackbarText.value = "berhasil menambah member";
        snackbarVisible.value = true;
        dialog.value = false
      })
      .catch(function (error) {
        console.log(error);
        snackbarText.value = error;
        snackbarVisible.value = true;
      });
  } catch (error) {}
}

async function goToDetail(id: string) {
  router.push(`poli/${id}`);
}
onMounted(() => {
  getListDoctor();
  getListPoli();
});
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
        <v-card-title class="text-h5 pt-sm-2 pb-7"
          >List Member Poli {{ currentPoliName }}</v-card-title
        >
        <v-btn color="success" @click="dialog = true">Tambah member</v-btn>
      </div>
      <v-table class="month-table">
        <thead>
          <tr class="bg-primary">
            <th class="text-subtitle-1 font-weight-bold">dokter</th>
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
          <tr v-else v-for="item in listPoli" :key="item.id" class="month-item">
            <td>
              <div class="">
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.doctor }}
                </h6>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-dialog v-model="dialog" width="500">
        <v-card prepend-icon="mdi-dock-top" title="data pegawai">
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="poliRequest.user_id"
                  :items="selectItem"
                  item-text="title"
                  item-value="value"
                  label="Select Doctor"
                ></v-select>
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
