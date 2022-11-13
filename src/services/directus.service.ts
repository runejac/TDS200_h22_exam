import { Directus } from "@directus/sdk";
import { constants } from "@/constants/constants";
import { toastController } from "@ionic/vue";

export const directus = new Directus(constants.DIRECTUS_INSTANCE, {
  auth: {
    mode: "json",
    // autoRefresh = false. For å stoppe refreshing av token,
    // om ikke måtte jeg etter logg ut, klikke 2 ganger på registrer
    // https://github.com/runejac/TDS200_h22_exam/issues/5
    autoRefresh: true,
  },
});

export const authService = {
  async login(email: string, password: string) {
    try {
      return await directus.auth.login({ email, password });
    } catch (e) {
      console.error(e);
      const errorToast = await toastController.create({
        message: "Feil brukernavn eller passord",
        duration: 5000,
        color: "warning",
      });
      await errorToast.present();
    }
  },

  async register(
    firstName: string,
    email: string,
    password: string
    /*avatar?: string*/
  ): Promise<boolean | null> {
    //localStorage.removeItem("auth_expires_at");
    // error handler for inputs on the back

    // FIXME:

    if (firstName.length > 0 && email.includes("@") && password.length > 0) {
      const createUserResult = await directus.users.createOne({
        first_name: firstName,
        email,
        password,
        role: constants.USER_ROLE,
        /*avatar,*/
      });

      return !!createUserResult?.email;
    } else {
      const errorToast = await toastController.create({
        message: "Feil i registrering, sjekk alle felt og husk @ i e-post.",
        duration: 5000,
        color: "danger",
      });
      await errorToast.present();
      return null;
    }
  },
  async logout() {
    return await directus.auth.logout();
  },
  async currentUser() {
    return await directus.users.me.read({
      fields: ["email", "first_name", "id", "avatar"],
    });
  },
};
