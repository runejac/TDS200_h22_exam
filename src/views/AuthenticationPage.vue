<script setup lang="ts">
import {
  IonInput,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonButton,
  IonLabel,
  IonModal,
  IonToolbar,
  IonHeader,
  IonIcon,
  IonTitle,
  IonItemGroup,
  IonButtons,
  modalController,
  IonPage,
  toastController,
} from "@ionic/vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService, directus } from "@/services/directus.service";
import { constants } from "@/constants/constants";
import { trashOutline } from "ionicons/icons";
import { Camera, CameraResultType } from "@capacitor/camera";

const router = useRouter();
const loginIsLoading = ref(false);
const isPostingToRegister = ref(false);
const newAvatar = ref();
const avatarFileId = ref();
const firstName = ref("");
const email = ref("");
const password = ref("");

const login = async (e: { preventDefault: () => void }) => {
  e.preventDefault();

  if (email.value.length > 0 && password.value.length > 0) {
    try {
      loginIsLoading.value = true;
      const response = await authService.login(email.value, password.value);

      if (response?.access_token) {
        await router.push("/browse");
        email.value = "";
        password.value = "";
        loginIsLoading.value = false;
      } else {
        loginIsLoading.value = false;
      }
    } catch (e) {
      loginIsLoading.value = false;
      console.error(e);
    }
  }
};

const loginAsGuestUser = async (e: { preventDefault: () => void }) => {
  e.preventDefault();

  try {
    await authService.login(
      constants.GUEST_USER_EMAIL,
      constants.GUEST_USER_PASSWORD
    );
    await router.push("/browse");
    email.value = "";
    password.value = "";
    const succsessToast = await toastController.create({
      message:
        "På besøk som gjest, registrer deg om du skal kjøpe eller legge ut spill.",
      duration: 5000,
      color: "success",
    });
    await succsessToast.present();
  } catch (e) {
    console.error(e);
  }
};

const clearLoginInputsAfterRegisterIsClicked = () => {
  email.value = "";
  password.value = "";
  firstName.value = "";
  // ref line 8-10 @ directus.service.ts
  // localStorage.removeItem("auth_expires_at");
};

const cancel = () => {
  modalController.dismiss();
};

const chooseOrTakePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 100,
    allowEditing: true,
    resultType: CameraResultType.Uri,
  });

  if (image.webPath) {
    newAvatar.value = image.webPath;
  }
};

const postAvatarToDb = async () => {
  if (newAvatar.value) {
    const response = await fetch(newAvatar.value);
    const fileBlob = await response.blob();
    const formData = new FormData();
    formData.append("file", fileBlob);
    const file = await directus.files.createOne(formData);

    avatarFileId.value = file?.id;
  }
};

const removeImageChosen = () => {
  newAvatar.value = "";
};

const register = async (e: { preventDefault: () => void }) => {
  e.preventDefault();
  await postAvatarToDb();

  try {
    const response = await authService.register(
      firstName.value,
      email.value,
      password.value,
      newAvatar.value ? avatarFileId.value : null
    );

    if ((await response) !== null) {
      await login(e);
      await router.push("/browse");
      await modalController.dismiss();
      email.value = "";
      password.value = "";
      firstName.value = "";
      newAvatar.value = "";
    }
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <ion-page>
    <ion-content class="background" :force-overscroll="false">
      <form v-on:submit="login" @keyup.enter="login">
        <ion-grid class="grid-login">
          <ion-row>
            <ion-col>
              <ion-modal
                ref="modal"
                trigger="open-modal"
                :initial-breakpoint="0.85"
              >
                <ion-title>Registrer ny bruker</ion-title>
                <ion-content class="modal-content">
                  <ion-item-group>
                    <ion-item>
                      <ion-label position="stacked"></ion-label>
                      <ion-input
                        v-model="firstName"
                        type="text"
                        placeholder="Fornavn"
                      ></ion-input>
                    </ion-item>
                    <ion-item>
                      <ion-label position="stacked"></ion-label>
                      <ion-input
                        v-model="email"
                        type="email"
                        placeholder="E-post"
                      ></ion-input>
                    </ion-item>
                    <ion-item>
                      <ion-label position="stacked"></ion-label>
                      <ion-input
                        v-model="password"
                        type="password"
                        placeholder="Passord"
                      ></ion-input>
                    </ion-item>

                    <section class="image-container">
                      <ion-label position="stacked"
                        >Velg avatar (valgfritt)</ion-label
                      >
                      <div
                        v-if="newAvatar"
                        class="has-been-added-image-container"
                      >
                        <div class="add-image">
                          <img
                            class="image-uploaded"
                            :src="newAvatar"
                            alt="image uploaded from gallery or storage"
                            @click="chooseOrTakePicture"
                          />
                        </div>
                        <ion-icon
                          class="button-delete-image-chosen"
                          @click="removeImageChosen"
                          :icon="trashOutline"
                        />
                      </div>

                      <div
                        v-else
                        class="will-be-added-image-container"
                        @click="chooseOrTakePicture"
                      >
                        <div class="add-image"></div>
                      </div>
                    </section>
                  </ion-item-group>
                  <div class="btns-register-container">
                    <ion-button class="btn-cancel" @click="cancel"
                      >Avbryt</ion-button
                    >
                    <ion-button @click="register">Bekreft</ion-button>
                  </div>
                </ion-content>
              </ion-modal>
              <div class="header-text-container">
                <h3 class="header-text">Retro Game Market</h3>
              </div>
              <div class="login-input-container">
                <ion-input
                  required
                  placeholder="E-post"
                  class="custom"
                  v-model="email"
                  type="email"
                />
                <ion-input
                  required
                  placeholder="Passord"
                  class="custom"
                  v-model="password"
                  type="password"
                />

                <div class="btns-login-container">
                  <ion-button :disabled="loginIsLoading" type="submit"
                    >Logg inn</ion-button
                  >
                  <ion-button
                    class="button-register"
                    id="open-modal"
                    @click="clearLoginInputsAfterRegisterIsClicked"
                    >Registrer
                  </ion-button>
                  <ion-button class="button-guest" @click="loginAsGuestUser"
                    >Gjestebruker</ion-button
                  >
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
ion-title {
  text-align: center;
  margin-block: 20px;
}

.header-text-container {
  font-family: "Saira", sans-serif;
  display: flex;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.login-input-container {
  top: 80px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.header-text {
  text-align: center;
  font-weight: 700;
  font-size: 4rem;
  color: #fff;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  position: relative;
  background: linear-gradient(
    to bottom,
    #ff00fb 0%,
    #ffe2ff 50%,
    #380a3f 51%,
    #c100f7 100%
  );
  background-blend-mode: multiply;
  background-size: 10px 100px;
  line-height: 1;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke-width: 0.001em;
  -webkit-text-stroke-color: rgba(181, 96, 194, 0.7);
}

ion-page {
  min-height: 100%;
  -webkit-backdrop-filter: blur(5px);
}

ion-content.background {
  --background: url("../../public/assets/img/retro-background.jpg") no-repeat
    center center/cover fixed;
}

ion-input.custom {
  font-family: "Fira Code", sans-serif;
  backdrop-filter: blur(20px);
  font-weight: 300;
  color: #d0cfb9;
  outline: 1px solid #d0cfb9;
  --placeholder-color: #d0cfb9;
  --placeholder-opacity: 0.4;
  --padding-bottom: 10px;
  --padding-end: 10px;
  --padding-start: 10px;
  --padding-top: 10px;

  &:hover,
  &:focus {
    --placeholder-opacity: 0.6;
    font-weight: 700;
    outline: 2px solid #d0cfb9;
    --box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.3);
  }
}

.btns-register-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  ion-button:nth-child(2)::part(native) {
    background: #005800;
    &:focus:active {
      background: #006800;
    }
  }
}

.btns-login-container {
  display: flex;
  flex-direction: column;
  gap: 10px;

  ion-button:nth-child(1) {
    margin-bottom: 40px;
  }
}

ion-button.btn-cancel::part(native) {
  background: #9b0c0c;
  &:focus:active {
    background: #ff5959;
  }
}

ion-button::part(native) {
  font-family: VT323, sans-serif;
  background: #6e137c;
  border-bottom: 6px inset rgba(0, 0, 0, 0.5);
  border-left: 6px inset rgba(0, 0, 0, 0.5);
  border-right: 6px inset rgba(255, 255, 255, 0.5);
  border-top: 6px inset rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  color: white;
  cursor: pointer;
  border-radius: 0;
  display: inline-block;
  font-size: 2rem;
  margin: 1rem;
  padding: 1rem;
  text-transform: uppercase;
  width: auto;

  &:focus:active {
    background: #821394;
  }
}

.button-register::part(native) {
  background: #005800;

  &:focus:active {
    background: #006800;
  }
}

.button-guest::part(native) {
  background: #000000;

  &:focus:active {
    background: #000000;
  }
}

.will-be-added-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px dashed #c2c2c2;
  border-radius: 50px;
  width: 80px;
  height: 80px;
}

.has-been-added-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 180px;
}

.button-delete-image-chosen {
  position: relative;
  display: flex;
  justify-content: center;
  align-self: flex-end;
  color: #ff8080;
  font-size: 2rem;
}

.add-image {
  font-size: 1.7rem;
  font-family: "Fira Code Medium", sans-serif;
}

.image-container {
  margin: 20px;
  display: flex;
  justify-content: flex-start;

  ion-label {
    font-size: 1.2rem;
    color: gray;
    font-family: "Fira Code Medium", sans-serif;
  }
}

.image-uploaded {
  max-height: 100px;
  border-radius: 50px;
}
</style>
