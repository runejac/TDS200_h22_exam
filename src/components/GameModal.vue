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

const dismiss = () => {
  modalController.dismiss();
};

interface PropsFromBrowseToModal {
  game: Games;
  handleModal: boolean;
}

defineProps<PropsFromBrowseToModal>();
</script>

<template>
  <ion-modal class="custom" ref="modal" :is-open="handleModal">
    <ion-content :force-overscroll="false">
      <ion-toolbar color="translucent">
        <ion-title>{{ game.title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button class="btn-close" color="light" @click="dismiss()"
            >Close</ion-button
          >
        </ion-buttons>
      </ion-toolbar>

      <ion-list>
        <!--custom component-->
        <game-image :game-price="game.price" :image-id="game.image.id" />
        <!--custom component-->
        <ion-item>
          <ion-text>
            <p v-for="property in game.properties" :key="property">
              {{ property }}
            </p>
          </ion-text>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<style scoped lang="scss">
ion-modal {
  --height: 70%;
  --width: 80%;
  --box-shadow: 1rem 1rem black;
}

ion-content {
  border: 5px solid #000;
}

.btn-close::part(native) {
  font-size: 1rem;
  color: rgba(5, 5, 5, 0.78);
}

ion-modal.custom {
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);
}

ion-toolbar {
  --background: rgba(96, 14, 144, 0.3);
  --background-color: transparent;
  --ion-color-base: transparent !important;
  color: black;
}
</style>
