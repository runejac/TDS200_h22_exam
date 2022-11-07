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
  IonTitle,
  IonItemGroup,
  IonButtons,
  modalController,
  IonPage,
} from "@ionic/vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/services/directus.service";

const router = useRouter();
const authenticationFailed = ref(false);
const registrationFailed = ref(false);
const email = ref("");
const password = ref("");
const firstName = ref("");

const login = async (e: { preventDefault: () => void }) => {
  e.preventDefault();

  if (email.value.length > 0 && password.value.length > 0) {
    try {
      await authService.login(email.value, password.value);
      authenticationFailed.value = false;
      await router.push("/browse");
      email.value = "";
      password.value = "";
    } catch (e) {
      authenticationFailed.value = true;
      console.error(e);
    }
  } else {
    registrationFailed.value = true;
  }
};

const loginAsGuestUser = async (e: { preventDefault: () => void }) => {
  e.preventDefault();

  try {
    // TODO sette email og passord til guest bruker til consts
    await authService.login("gjest@gjest.com", "123");
    await router.push("/browse");
    email.value = "";
    password.value = "";
  } catch (e) {
    console.error(e);
  }
};

const clearLoginInputsAfterRegisterIsClicked = () => {
  email.value = "";
  password.value = "";
};

const cancel = () => {
  modalController.dismiss();
};

const register = async (e: { preventDefault: () => void }) => {
  e.preventDefault();
  try {
    await authService.register(firstName.value, email.value, password.value);
    await login(e);
    await modalController.dismiss();
  } catch (error) {
    console.error(error);
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
                <ion-header>
                  <ion-toolbar>
                    <ion-buttons slot="start">
                      <ion-button @click="cancel()">Avbryt</ion-button>
                    </ion-buttons>
                    <ion-title
                      v-bind:class="
                        registrationFailed ? 'not-properly-registered' : ''
                      "
                      class="ion-text-center"
                      >{{
                        registrationFailed
                          ? "Woops! Feil i felt!"
                          : "Registrer ny bruker"
                      }}</ion-title
                    >
                    <ion-buttons slot="end">
                      <ion-button :strong="true" @click="register"
                        >Bekreft</ion-button
                      >
                    </ion-buttons>
                  </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
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
                  </ion-item-group>
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
                  type="text"
                />
                <ion-input
                  required
                  placeholder="Passord"
                  class="custom"
                  v-model="password"
                  type="password"
                />

                <div class="buttons">
                  <ion-button type="submit">Login</ion-button>
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

.buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

  &:focus {
    background: #821394;
  }
}

.button-register::part(native) {
  background: #005800;

  &:focus {
    background: #006800;
  }
}

.button-guest::part(native) {
  background: #000000;

  &:focus {
    background: #000000;
  }
}

/*ion-item.custom {
  --background: transparent;
}*/

.not-authorized,
.not-properly-registered {
  color: red;
  background-color: pink;
}
</style>
