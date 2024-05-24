export default defineNuxtRouteMiddleware((to, from) => {
  const role = getUserSession()?.role;

  if (role !== "RESEPSIONIS") {
    return navigateTo("/");
  }
});
