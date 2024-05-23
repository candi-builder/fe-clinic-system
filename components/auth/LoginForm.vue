<script setup lang="ts">
import axios from "axios";
import { saveUserSession, getUserSession } from "@/utils/session";
const config = useRuntimeConfig();

const loginRequest = reactive({
  username: "",
  password: "",
});
const router = useRouter();
//snackbar toogle
const snackbarVisible = ref(false);
const snackbarText = ref<string>("");
const isLoading = ref<boolean>(false);
async function navigationBaseOnRole(role: string) {
  router.push({ path: `/${role.toLocaleLowerCase()}` });
}
async function login() {
  isLoading.value = true;
  try {
    axios
      .post(`${config.public.baseUrl}/auth/login`, loginRequest)
      .then(function (response) {
        console.log(response);

        snackbarVisible.value = true;
        snackbarText.value = response.data.message;
        isLoading.value = false;
        if (response.data.data) {
          saveUserSession(response.data.data);
          navigationBaseOnRole(response.data.data.role);
        }
      })
      .catch(function (error) {
        snackbarText.value = error.message;
        isLoading.value = false;
      });
  } catch (error) {
    console.log(error);
    snackbarText.value = "server bermasalah";
    isLoading.value = false;
  }
}
</script>

<template>
  <v-row class="d-flex mb-3">
    <MySnackbar
      v-model:modelValue="snackbarVisible"
      :text="snackbarText"
      :timeout="2000"
    ></MySnackbar>
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">Username</v-label>
      <v-text-field
        v-model="loginRequest.username"
        variant="outlined"
        hide-details
        color="primary"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">Password</v-label>
      <v-text-field
        v-model="loginRequest.password"
        variant="outlined"
        type="password"
        hide-details
        color="primary"
      ></v-text-field>
    </v-col>
    <v-col cols="12" class="pt-0">
      <v-btn
        @click="login"
        :disabled="isLoading"
        :loading="isLoading"
        color="primary"
        size="large"
        block
        flat
        >Masuk</v-btn
      >
    </v-col>
  </v-row>
</template>
