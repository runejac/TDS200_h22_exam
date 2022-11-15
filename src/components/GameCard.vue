<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from "@ionic/vue";
import GameImage from "@/components/GameImage.vue";
import { Games } from "@/types/types";

interface PropsFromHomeToCard {
  game: Games;
}

// henter props fra HomePage.vue
defineProps<PropsFromHomeToCard>();
</script>

<!--<ion-card @click="() => router.push(`/detail/${game.id}`)">-->

<template>
  <ion-card>
    <!--custom component-->
    <game-image :game-price="game.price" :image-id="game.image.id" />
    <!--custom component-->
    <ion-card-header>
      <p>{{ game.platform }}</p>
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
    </ion-card-content>
  </ion-card>
</template>

<style scoped lang="scss">
ion-card-header {
  p {
    margin: 0;
  }
}

.mint {
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
  color: #252525;
  font-family: Saira, monospace;
  font-size: 1rem;
  font-weight: 700;
  width: fit-content;
}

.used {
  color: rgba(37, 37, 37, 0.58);
  font-family: Saira, monospace;
  font-size: 1rem;
  font-weight: 700;
  width: fit-content;
}

ion-card-content > p {
  color: rgba(37, 37, 37, 0.6);
  font-family: Saira, monospace;
  font-size: 1rem;
  font-weight: 700;
  width: fit-content;
}

ion-card-title {
  font-family: VT323, monospace;
  font-size: 1.5rem;
  color: #252525;
  text-decoration: underline 0.1em #252525;
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
      #f8d034 10%,
      rgba(255, 225, 0, 0.3)
    );
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
}

ion-card {
  outline: 1px solid black;
  box-shadow: 0.7rem 0.7rem black;
  color: #252525;
  border-radius: 0;
  height: min-content;
  font-weight: bold;
  font-size: 0.8rem;
  background: #e8e6dc;
}

/*ion-button {
  font-family: "Fira Code", monospace;
}*/
</style>
