<script setup lang="ts">
import {
  IonModal,
  IonContent,
  IonToolbar,
  IonTitle,
  IonText,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  modalController,
} from "@ionic/vue";
import GameImage from "@/components/GameImage.vue";
import { Games } from "@/types/types";
import { useRouter } from "vue-router";

const router = useRouter();

const dismiss = () => {
  modalController.dismiss();
};

interface PropsFromBrowseToModal {
  game: Games;
  handleModal: boolean;
}

const props = defineProps<PropsFromBrowseToModal>();

const handleRouterAndModal = () => {
  router.push(`/detail/${props.game.id}`);
  modalController.dismiss();
};
</script>

<template>
  <ion-modal class="custom" ref="modal" :is-open="handleModal">
    <ion-content no-bounce :has-bouncing="false" :force-overscroll="false">
      <ion-toolbar color="translucent">
        <ion-title>{{ game.title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button class="btn-close" @click="dismiss()">Lukk</ion-button>
        </ion-buttons>
      </ion-toolbar>

      <ion-list>
        <!--custom component-->
        <game-image :game-price="game.price" :image-id="game.image.id" />
        <!--custom component-->

        <ion-text>
          <ul class="ul-properties-container-detail">
            <li
              class="properties"
              v-for="property in game.properties"
              :key="property"
            >
              {{ property }}
            </li>
          </ul>
        </ion-text>
        <p
          v-bind:class="
            game.condition === 'Mint Condition'
              ? 'mint'
              : game.condition === 'Ny'
              ? 'new'
              : 'used'
          "
        >
          {{ game.condition }}
        </p>
        <ion-text>
          <p class="description">{{ game.description }}</p>
        </ion-text>
        <ion-buttons class="btn-details-container" slot="end">
          <ion-button
            class="btn-details"
            color="light"
            @click="handleRouterAndModal"
            >Kjøp / kontakt selger</ion-button
          >
        </ion-buttons>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<style scoped lang="scss">
ion-title {
  font-family: VT323, monospace;
  font-size: 1.5rem;
  color: #252525;
  text-decoration: underline 0.1em #252525;
  font-weight: 300;
}

.mint {
  padding: 0.1em;
  margin-inline: 5px;
  font-family: Saira, monospace;
  font-size: 1rem;
  font-weight: 700;
  width: fit-content;
  background-image: linear-gradient(45deg, #0030ef, #eb34f8);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.new {
  padding: 0.1em;
  margin-inline: 5px;
  color: #252525;
  font-family: Saira, monospace;
  font-size: 1rem;
  font-weight: 700;
  width: fit-content;
}

.used {
  padding: 0.1em;
  margin-inline: 5px;
  color: rgba(37, 37, 37, 0.58);
  font-family: Saira, monospace;
  font-size: 1rem;
  font-weight: 700;
  width: fit-content;
}

.scroll-content {
  // todo sjekk om denne fungerer bra på telefon
  overflow-y: auto;
}

ion-modal {
  --height: 75%;
  --width: 80%;
  --background: black;
}

ion-content {
  border: 5px solid #000;
  animation: flicker 2s ease alternate infinite;
}

ion-list {
  height: fit-content;
}

.btn-close::part(native) {
  font-size: 1rem;
  color: rgba(5, 5, 5, 0.78);
}

.btn-details-container {
  display: flex;
  justify-content: center;
  margin-block: 2rem;
  position: relative;
}

.btn-details {
  display: flex;
  position: relative;
  margin: 0;
  border-bottom: 2px #2aa146 solid;
}

.btn-details::part(native) {
  font-family: VT323, monospace;
  font-size: 1.5rem;
  font-weight: 300;
  color: #2aa146;
}

ion-modal.custom {
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(1px);
}

ion-toolbar {
  --background-color: #e8e6dc;
  color: black;
}

.description {
  padding: 0.1em 0.5em;
  font-size: 0.9rem;
}

.ul-properties-container-detail {
  display: flex;
  list-style: none;
  flex-direction: row;
  position: relative;
  padding: 0.1em 0.4em;
  justify-content: center;
  align-items: center;

  li {
    display: flex;
    font-family: "Fira Code", monospace;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.1rem 0.4rem;
    border-radius: 0;
    background-image: linear-gradient(
      to right,
      rgba(105, 96, 31, 0.1),
      #f8d034 10%,
      rgba(255, 225, 0, 0.3)
    );
  }
}

@keyframes flicker {
  0% {
    border-color: #573bd3;
  }
  50% {
    border-color: #1f44d7;
  }
  100% {
    border-color: #f605b2;
  }
}
</style>
