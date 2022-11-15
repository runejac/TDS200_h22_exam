import { Directus } from "@directus/sdk";
import { constants } from "@/constants/constants";
import { toastController } from "@ionic/vue";

export const directus = new Directus(constants.DIRECTUS_INSTANCE, {
  auth: {
    mode: "json",
    // hatt noen issues med en refresh_token feil
    // prøvd med autoRefresh = false. For å stoppe refreshing av token,
    // men da går den ikke tilbake til login siden når det er gått 15 min
    // jeg har tidligere måttet klikket 2 ganger på registrer, men det ser ut til å OK nå
    // har litt forklaring her som pointer til noen issues andre har hatt relatert til samme problem
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
    password: string,
    avatar?: string
  ): Promise<boolean | null> {
    try {
      if (firstName.length > 0 && email.includes("@") && password.length > 0) {
        const createUserResult = await directus.users.createOne({
          first_name: firstName,
          email,
          password,
          role: constants.USER_ROLE,
          avatar,
        });

        return !!createUserResult?.email;
      } else {
        // feilhåndtering dersom ikke alle feltene er fylt ut eller om det mangler @ i e-post
        const errorToast = await toastController.create({
          message: "Feil ved registrering, sjekk alle felt og husk @ i e-post.",
          duration: 5000,
          color: "danger",
        });
        await errorToast.present();
        return null;
      }
    } catch (e) {
      // trigges dersom e-posten allerede er registrert hos Directus
      const errorToast = await toastController.create({
        message: "Feil ved registrering, e-post er allerede i bruk.",
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
