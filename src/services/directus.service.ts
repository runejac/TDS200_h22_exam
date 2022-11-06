import { Directus } from "@directus/sdk";
import { constants } from "@/constants/constants";

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
  ): Promise<boolean> {
    const createUserResult = await directus.users.createOne({
      first_name: firstName,
      email,
      password,
      role: "cf526ddb-9fc2-4b13-90a7-42f5f7069b65",
    });

    return !!createUserResult?.email;
  },
  async logout() {
    return await directus.auth.logout();
  },
  async currentUser() {
    return await directus.users.me.read({
      fields: ["email", "first_name", "id"],
    });
  },
};
