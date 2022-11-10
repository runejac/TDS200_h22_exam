import { Directus } from "@directus/sdk";
import { constants } from "@/constants/constants";
import { toastController } from "@ionic/vue";

export const directus = new Directus(constants.DIRECTUS_INSTANCE, {
  auth: {
    mode: "json",
  },
});

// fra forelesning
export const authService = {
  async login(email: string, password: string) {
    return await directus.auth.login({ email, password });
  },

  async register(
    firstName: string,
    email: string,
    password: string
    /*    avatar?: string | undefined*/
  ): Promise<boolean | null> {
    // error handler for inputs on the back
    console.log(firstName, email, password);
    if (firstName.length > 0) {
      const createUserResult = await directus.users.createOne({
        first_name: firstName,
        email,
        password,
        role: constants.USER_ROLE,
        /*        avatar,*/
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
