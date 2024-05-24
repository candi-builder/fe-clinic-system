export default defineNuxtRouteMiddleware((to, from) => {
  if (sessionStorage.getItem("userSession") == null) {
    return navigateTo("/");
  }


});
