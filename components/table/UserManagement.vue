<script setup lang="ts">
import { UserResponse } from "@/types/user";
import axios from "axios";
const listUser = ref<UserResponse[]>([]);

const config = useRuntimeConfig();
const baseUrl = config.public.baseUrl;
const dialog = ref<boolean>(false);
const dialogPecat = ref<boolean>(false);
const snackbarVisible = ref(false);
const snackbarText = ref<string>("");
const selectItem = [
  {
    title: "Dokter",
    value: "DOKTER",
  },
  {
    title: "Resepsionis",
    value: "RESEPSIONIS",
  },
  {
    title: "Apoteker",
    value: "APOTEKER",
  },
];
const userRequest = reactive({
  username: "",
  full_name: "",
  role: "",
});
async function getListAntrian() {
  try {
    axios
      .get(`${baseUrl}/users`)
      .then(function (response) {
        listUser.value = response.data.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {}
}
function openFormAddUser() {
  dialog.value = true;
}
async function registerUser() {
  axios
    .post(`${baseUrl}/auth/register-user`, userRequest)
    .then(function (response) {
      console.log(response.data);
      getListAntrian();
      dialog.value = false;
      snackbarText.value =  response.data.message 
      snackbarVisible.value = true
    })
    .catch(function (error) {
      console.log(error);
    });
}
const selectedUserId = ref<string | null>(null);

async function pecatPegawai() {
  axios
    .delete(`${baseUrl}/users/${selectedUserId.value}`)
    .then(function (response) {
      getListAntrian();
      snackbarText.value =  response.data.message 
      snackbarVisible.value = true
      dialogPecat.value = false
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function resetPassword(idPegawai: string) {
  axios
    .put(`${baseUrl}/users/${idPegawai}`,{password: "isvill15001"})
    .then(function (response) {
      console.log(response.data);
      
      getListAntrian();
      snackbarText.value = 'password berhasil di reset menjadi isvill15001'
      snackbarVisible.value = true
      dialogPecat.value = false
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function openDialogPecat(idPegawai: string) {
  selectedUserId.value = idPegawai
  dialogPecat.value = true
}

onMounted(() => {
  getListAntrian();
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
        <v-card-title class="text-h5 pt-sm-2 pb-7">List pegawai</v-card-title>
        <v-btn color="success" @click="openFormAddUser">Tambah pegawai</v-btn>
      </div>
      <v-table class="month-table">
        <thead>
          <tr class="bg-primary">
            <th class="text-subtitle-1 font-weight-bold">username</th>
            <th class="text-subtitle-1 font-weight-bold">full name</th>
            <th class="text-subtitle-1 font-weight-bold">role</th>
            <th class="text-subtitle-1 font-weight-bold">aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="listUser.length < 1">
            <td colspan="5">
              <p class="text-15 font-weight-medium text-center">
                Belum ada User
              </p>
            </td>
          </tr>
          <tr
            v-else
            v-for="item in listUser"
            :key="item.uuid"
            class="month-item"
          >
            <td>
              <div class="">
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.username }}
                </h6>
              </div>
            </td>
            <td>
              <h6 class="text-body-1 text-muted">{{ item.fullname }}</h6>
            </td>
            <td>
              <h6 class="text-body-1 font-weight-bold">{{ item.role }}</h6>
            </td>
            <td class="d-flex gap-2">
              <v-btn @click="resetPassword(item.uuid)" color="primary">Reset Password</v-btn>
              <v-btn @click="openDialogPecat(item.uuid)" color="error">pecat</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-dialog v-model="dialog" width="500">
        <v-card prepend-icon="mdi-account" title="data pegawai">
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="userRequest.username"
                  color="deep-purple"
                  type="text"
                  label="username"
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="userRequest.full_name"
                  color="deep-purple"
                  type="text"
                  label="nama lengkap"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  label="Pilih Role"
                  v-model="userRequest.role"
                  :items="selectItem"
                  color="deep-purple"
                  item-text="title"
                  item-value="value"
                  variant="outlined"
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
              @click="registerUser()"
              >kirim</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
      v-model="dialogPecat"
      max-width="400"
      persistent
    >
      <v-card
        prepend-icon="mdi-account-question"
        text="yakin ingin menghapus user ini."
        title="Hapus User?"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn variant="elevated" color="warning" @click="dialogPecat = false">
            batal
          </v-btn>

          <v-btn variant="flat" color="error" @click="pecatPegawai">
            Iya
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
    </v-card-item>
  </v-card>
</template>
