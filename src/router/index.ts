import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import AuthenticationPage from "../views/AuthenticationPage.vue";
import BrowsePage from "../views/BrowsePage.vue";
import { authService } from "@/services/directus.service";
import { toastController } from "@ionic/vue";

const authenticationRequiredRouteGuard = async () => {
  // function that times out user and deletes auth_token after 15min
  // also Route Guarding the auth-page, if not logged in
  // /authentication will force
  const userAccessToken = localStorage.getItem("auth_token");
  if (!userAccessToken) return { name: "Authentication" };
  const userAccessTokenExpiresAt = localStorage.getItem(
    "auth_expires_at"
  ) as unknown as number;

  if (userAccessTokenExpiresAt < new Date().getTime()) {
    const errorToast = await toastController.create({
      message: "Brukersesjon er utløpt - logg inn på nytt",
      duration: 5000,
      color: "warning",
    });
    await errorToast.present();

    await authService.logout();
    return { name: "Authentication" };
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/authentication",
  },
  {
    path: "/authentication",
    name: "Authentication",
    component: AuthenticationPage,
    alias: ["/auth", "/login"],
  },
  {
    path: "/browse",
    name: "Browse",
    component: BrowsePage,
    alias: ["/hjem", "/home", "/start"],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
