<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timeout: {
    type: Number,
    default: 2000,
  },
});

const emit = defineEmits(["update:modelValue"]);

const closeSnackbar = () => {
  emit("update:modelValue", false);
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      setTimeout(closeSnackbar, props.timeout);
    }
  }
);
</script>
<template>
  <v-snackbar v-model="props.modelValue">
    {{ props.text }}

    <template v-slot:actions>
      <v-btn color="primary" variant="text" @click="closeSnackbar">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
