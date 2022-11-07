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
  IonIcon,
  IonCol,
  IonFab,
  modalController,
  IonFabButton,
  IonModal,
  IonText,
  IonList,
  IonItem,
  IonRefresher,
  IonToolbar,
  onIonViewDidEnter,
} from "@ionic/vue";
import { settingsOutline } from "ionicons/icons";
import GameCard from "@/components/GameCard.vue";
/*import GameModal from "@/components/GameModal.vue";*/
import GameImage from "@/components/GameImage.vue";

import { directus } from "@/services/directus.service";
import { ref } from "vue";
import { Games, GamesResponse } from "@/types/types";
import GameModal from "@/components/GameModal.vue";

const retroGames = ref<Games[]>();
const isLoadingData = ref(true);
const sendToModal = ref();
const handleModal = ref(false);

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

const doRefresh = async (e: { target: { complete: () => any } }) => {
  await gameQuery();
  e.target.complete();
};

const sendGameToModal = (id: any) => {
  handleModal.value = true;
  sendToModal.value = retroGames.value?.find((game) => game.id === id);
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

    <ion-content @click="handleModal = false" :fullscreen="true">
      <!--custom component-->
      <game-modal :game="sendToModal" :handleModal="handleModal" />
      <!--custom component-->
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-grid>
        <!--custom component-->
        <game-card
          v-for="game in retroGames"
          :key="game.id"
          :game="game"
          :image-id="game.image.id"
          @click="sendGameToModal(game.id)"
        />
        <!--custom component-->
      </ion-grid>
    </ion-content>
    <ion-fab
      class="ion-margin"
      slot="fixed"
      style="position: absolute; right: 0; bottom: 0"
    >
      <ion-fab-button color="success">+</ion-fab-button>
    </ion-fab>
  </ion-page>
</template>

<style scoped lang="scss">
ion-title {
  font-family: Saira, monospace;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
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

ion-grid {
  grid-template-columns: auto auto;
  display: grid;
}

ion-content {
  font-family: "Fira Code", sans-serif;
}

ion-content::part(background) {
  --background: #f8d034;
  font-family: "Fira Code", sans-serif;
}

ion-toolbar {
  font-family: VT323, sans-serif;
  --opacity: 0.7;
  ion-title {
    font-size: 2rem;
  }
}

ion-fab-button::part(native) {
  background: #2aa146;
  border-bottom: 6px inset rgba(0, 0, 0, 0.5);
  border-left: 6px inset rgba(0, 0, 0, 0.5);
  border-right: 6px inset rgba(255, 255, 255, 0.5);
  border-top: 6px inset rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  color: white;
  cursor: pointer;
  border-radius: 10px;
  display: inline-block;
  font-size: 2rem;
  text-transform: uppercase;

  &:focus:active {
    background: #15e343;
  }
}

/*ion-toolbar {
  --background: #ffffff;
  font-family: "Saira", sans-serif;
}*/
</style>
