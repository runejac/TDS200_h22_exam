<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonButtons,
  IonCol,
  IonButton,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import GameImage from "@/components/GameImage.vue";
import { Games } from "@/types/types";

const router = useRouter();

interface PropsFromHomeToCard {
  game: Games;
}

// henter props fra HomePage.vue
defineProps<PropsFromHomeToCard>();
</script>

<!--<ion-card @click="() => router.push(`/detail/${game.id}`)">-->

<template>
  <ion-col size="6">
    <ion-card>
      <!--custom component-->
      <game-image :game-price="game.price" :image-id="game.image.id" />
      <!--custom component-->
      <ion-card-header>
        <ion-card-title>{{ game.title }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
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

        <!--        {{ game.description }}-->
      </ion-card-content>
      <!--      <ion-button slot="end" fill="clear">Kjøp</ion-button>-->
    </ion-card>
  </ion-col>
</template>

<style scoped lang="scss">
ion-card-title {
  text-decoration: underline 0.1em #000;
}

.ul-properties-container-detail {
  display: flex;
  list-style: none;
  flex-direction: column;
  position: relative;
  padding: 0;
  justify-content: space-between;
  align-items: flex-start;
  gap: 5px;

  li {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    padding-inline: 5px;
    justify-content: space-between;
    margin: 0 -0.4em;
    padding: 0.1em 0.4em;
    border-radius: 0.8em 0.3em;
    background-image: linear-gradient(
      to right,
      rgba(255, 225, 0, 0.1),
      rgba(255, 225, 0, 0.7) 10%,
      rgba(255, 225, 0, 0.3)
    );
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
}

ion-card {
  border: 2px #8f3bd3 solid;
  animation: flicker 2s ease alternate infinite;
  box-shadow: 0.7rem 0.7rem black;
  color: #252525;
  border-radius: 10px;
  font-weight: bold;
  font-size: 0.8rem;
}
@keyframes flicker {
  0% {
    border: 2px #573bd3 solid;
  }
  50% {
    border: 2px #1f44d7 solid;
  }
  100% {
    border: 2px #d33b3b solid;
  }
}
ion-button {
  font-family: "Fira Code", monospace;
}
</style>
