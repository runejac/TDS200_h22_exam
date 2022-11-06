<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonButton,
  IonButtons,
  IonPage,
  IonRefresherContent,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonFab,
  IonFabButton,
  IonRefresher,
  IonToolbar,
  onIonViewDidEnter,
} from "@ionic/vue";
import { settingsOutline } from "ionicons/icons";
import GameCard from "@/components/GameCard.vue";

import { directus } from "@/services/directus.service";
import { ref } from "vue";
import { Games, GamesResponse } from "@/types/types";

const retroGames = ref<Games[]>();
const isLoadingData = ref(true);

onIonViewDidEnter(async () => {
  await gameQuery();
});

const gameQuery = async () => {
  const response = await directus.graphql.items<GamesResponse>(`
    query {
      games {
        id
        title
        description
        properties
        price
        image {
          id
        }
        user_created {
          first_name
        }
      }
    }
  `);

  if (response.status === 200 && response.data) {
    retroGames.value = [...response.data.games];

    if (retroGames.value.length > 0) {
      isLoadingData.value = false;
    }
  }
};

console.log(retroGames.value);

const doRefresh = async (e: { target: { complete: () => any } }) => {
  await gameQuery();
  e.target.complete();
};
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title slot="start">Retro Game Market 🕹️</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/settings">
            <ion-icon slot="end" :icon="settingsOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-grid>
        <ion-row v-for="game in retroGames" :key="game.id">
          <!--custom component-->
          <game-card
            v-for="game in retroGames"
            :key="game.id"
            :game="game"
            :image-id="game.image.id"
          />
          <!--custom component-->
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-fab
      class="ion-margin"
      slot="fixed"
      style="position: absolute; right: 0; bottom: 0"
    >
      <ion-fab-button color="success" router-link="/new-game">+</ion-fab-button>
    </ion-fab>
  </ion-page>
</template>

<style scoped lang="scss">
ion-content {
  font-family: "Fira Code", sans-serif;
}

ion-content::part(background) {
  --background: #efdfd5;
  font-family: "Fira Code", sans-serif;
}

ion-toolbar {
  font-family: VT323, sans-serif;
  --opacity: 0.7;
  ion-title {
    font-size: 2rem;
  }
}

/*ion-toolbar {
  --background: #ffffff;
  font-family: "Saira", sans-serif;
}*/
</style>
