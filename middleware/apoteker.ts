export default defineNuxtRouteMiddleware((to, from) => {
  const role = getUserSession()?.role;

  if (role !== "APOTEKER") {
    return navigateTo("/");
  }
});
