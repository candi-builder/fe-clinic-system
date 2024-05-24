export default defineNuxtRouteMiddleware((to, from) => {
  const role = getUserSession()?.role;

  if (role !== "DOKTER") {
    return navigateTo("/");
  }
});
