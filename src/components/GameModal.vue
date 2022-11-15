<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import GameImage from "@/components/GameImage.vue";
import { Games } from "@/types/types";
import { useRouter } from "vue-router";
import { chatboxOutline, addOutline } from "ionicons/icons";

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
        <ion-buttons class="btn-close-container" slot="end">
          <ion-button @click="dismiss()">
            <ion-icon class="icon-close" :icon="addOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <section>
        <!--custom component-->
        <game-image
          class="game-image"
          :game-price="game.price"
          :image-id="game.image.id"
        />
        <!--custom component-->
      </section>
      <section>
        <ul class="ul-properties-container-detail">
          <li
            class="properties"
            v-for="property in game.properties"
            :key="property"
          >
            {{ property }}
          </li>
        </ul>

        <div class="condition-platform-container">
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
          <p class="platform">{{ game.platform }}</p>
        </div>
        <div class="description-container">
          <p class="description">{{ game.description }}</p>
        </div>
      </section>
      <div class="btn-details-container">
        <ion-button
          class="btn-details"
          color="light"
          @click="handleRouterAndModal"
          >Kjøp / detaljer</ion-button
        >
      </div>
    </ion-content>
  </ion-modal>
</template>

<style scoped lang="scss">
.btn-close-container {
  margin: 0;
}

.icon-close {
  transform: rotate(45deg);
  color: #ff5959;
  font-size: 2.5rem;
  font-weight: 700;
}

.game-image {
  margin-left: auto;
  margin-right: auto;
  max-width: 200px;
  height: auto;
}

ion-title {
  font-family: VT323, monospace;
  font-size: 1.5rem;
  color: #252525;
  text-decoration: underline 0.1em #252525;
  font-weight: 300;
}

.condition-platform-container > * {
  padding: 0.1em;
  margin-inline: 5px;
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.condition-platform-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.platform {
  color: #737373;
}

.mint {
  font-family: Saira, monospace;
  width: fit-content;
  background-image: linear-gradient(45deg, #0030ef, #eb34f8);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.new {
  color: #252525;
  font-family: Saira, monospace;
  font-weight: 700;
  width: fit-content;
}

.used {
  color: rgba(37, 37, 37, 0.58);
  font-family: Saira, monospace;
  font-weight: 700;
  width: fit-content;
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

.btn-details-container {
  display: flex;
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 40px;
}

.btn-details::part(native) {
  // FIXME style 1
  /*font-family: "Fira Code", monospace;
  font-size: 1rem;
  font-weight: 700;
  color: #e8e6dc;
  background: #2aa146;*/

  // FIXME style 2
  background: #2aa146;
  border-bottom: 6px inset rgba(0, 0, 0, 0.5);
  border-left: 6px inset rgba(0, 0, 0, 0.5);
  border-right: 6px inset rgba(255, 255, 255, 0.5);
  border-top: 6px inset rgba(255, 255, 255, 0.5);
  color: #e8e6dc;
  cursor: pointer;
  border-radius: 10px;
  font-size: 1.2rem;
  text-transform: uppercase;

  &:focus:active {
    background: #15e343;
  }
}

ion-modal.custom {
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(1px);
}

ion-toolbar {
  --background-color: #e8e6dc;
  color: black;
}

.description-container {
  padding: 0.2em 0.8em 0 0.8em;
}

.description {
  margin: 1em 0 0 0;
  font-size: 0.9rem;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
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
