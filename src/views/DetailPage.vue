<script setup lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
  toastController,
} from "@ionic/vue";
import { MapboxMap, MapboxMarker } from "@studiometa/vue-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { chatboxEllipsesOutline, trashOutline } from "ionicons/icons";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { authService, directus } from "@/services/directus.service";
import { GameResponseDetails, Games, PositionCoordinates } from "@/types/types";
import GameImage from "@/components/GameImage.vue";
import { constants } from "@/constants/constants";

const route = useRoute();
const { id } = route.params;
const isModalOpen = ref(false);
const currentUserId = ref();
const positionCoordinates = ref<PositionCoordinates>();
const newComment = ref("");
const addressFromCoordinates = ref("");
const positionForAddress = ref();
const isLoadingData = ref(true);
const isUploadingComment = ref(false);
const games = ref<Games[]>();

onIonViewDidEnter(async () => {
  await gameDetailsQuery();
  await getCurrentUserId();
  await convertFromGameObjectToPositionCoordinates();
  await fetchAddress();
});

const gameDetailsQuery = async () => {
  const response = await directus.graphql.items<GameResponseDetails>(`
    query {
      games_by_id(id:${id}) {
        id
        title
        description
        properties
        price
        condition
        position
        platform
        image {
          id
        }
        comments {
          id
          content
          date_created
          user_created {
            id
            first_name
          }
        }
        user_created {
          id
          first_name
        }
      }
    }
  `);

  if (response.status === 200 && response.data) {
    games.value = response.data.games_by_id;

    isLoadingData.value = false;
  }
};

const sendCommentToDatabase = async (e: { preventDefault: () => void }) => {
  e.preventDefault();

  try {
    if (newComment.value.length > 0) {
      isUploadingComment.value = true;
      await directus.items("game_comments").createOne({
        content: newComment.value,
        game_comment_id: id,
      });
      isUploadingComment.value = false;
      const successToast = await toastController.create({
        message: "Lagt til kommentar",
        duration: 2000,
        color: "success",
      });
      await successToast.present();
      isModalOpen.value = false;
      // refresh kommentarer etter det er lagt til
      await gameDetailsQuery();
      newComment.value = "";
    } else {
      isUploadingComment.value = false;
    }
  } catch (e) {
    console.error(e);
  }
};

const getCurrentUserId = async () => {
  const currentUserIdResponse = await authService.currentUser();
  currentUserId.value = currentUserIdResponse.id;
};

const commentDelete = async (commentId: number) => {
  const confirmedDeletion = confirm(
    "Er du sikker på at du vil slette denne kommentaren?"
  );

  if (confirmedDeletion) {
    try {
      await directus.items("game_comments").deleteOne(commentId);
      const successToast = await toastController.create({
        message: "Slettet kommentar",
        duration: 2000,
        color: "warning",
      });
      await successToast.present();
      await gameDetailsQuery();
    } catch (e) {
      console.error(e);
    }
  }
};
const convertFromGameObjectToPositionCoordinates = async () => {
  // som brukes til API geocoding i functionen fetchAddress

  positionForAddress.value = games?.value;
  const gameResponse: object = await positionForAddress.value;
  // henter ut verdiene i objektet
  const arrayOfGame = Object.values(gameResponse);
  // henter ut index 6 som er position
  const positionIndex = arrayOfGame[6];
  // henter ut index 6 som er et objekt med lat og long
  const positionArray = Array(positionIndex);
  // henter ut index 0 som er et objekt med lat og long
  const positionObject: { coordinates: number[] } = await positionArray[0];
  // plasserer lat og long numbers i egne variabler
  const longitude = positionObject.coordinates[0];
  const latitude = positionObject.coordinates[1];

  // har disse i en ref som brukes for å hente adressen i mapbox APIet som reverse geoocoder det om til lesbar adresse
  positionCoordinates.value = {
    longitude,
    latitude,
  };
};

const fetchAddress = async () => {
  const reversedGeocodingResponse = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${positionCoordinates.value?.longitude},${positionCoordinates.value?.latitude}.json?access_token=${constants.MAPBOX_TOKEN}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await reversedGeocodingResponse.json();
  // får ut adressen til en ref som brukes i template for å vise adresse
  addressFromCoordinates.value = data.features[0].place_name;
};

const goToGoogleMapsLink = () => {
  const googleMapsLink = `
  https://www.google.com/maps/?q=${positionCoordinates.value?.latitude},${positionCoordinates.value?.longitude}
  `;
  window.open(googleMapsLink, "_blank");
};
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="ion-text-center">{{ games?.title }}</ion-title>
        <ion-buttons slot="start">
          <ion-back-button default-href="/browse"></ion-back-button>
        </ion-buttons>

        <ion-buttons slot="end">
          <ion-button @click="isModalOpen = true">
            <ion-icon :icon="chatboxEllipsesOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!--loading spinner-->
    <ion-content v-if="isLoadingData">
      <ion-spinner class="spinner" name="crescent"></ion-spinner>
    </ion-content>

    <ion-content v-else :fullscreen="true">
      <section>
        <!--custom id-->
        <game-image :image-id="games?.image.id" :game-price="games?.price" />
        <!--custom id-->
      </section>

      <section class="ion-text-center ion-margin">
        <ul class="ul-properties-container-detail">
          <li v-for="property in games?.properties" :key="property">
            {{ property }}
          </li>
        </ul>
        <div class="condition-platform-container">
          <p
            v-bind:class="
              games?.condition === 'Mint Condition'
                ? 'mint'
                : games?.condition === 'Ny'
                ? 'new'
                : 'used'
            "
          >
            {{ games?.condition }}
          </p>
          <p class="platform">{{ games?.platform }}</p>
        </div>
        <ion-text class="description-container">
          <p>
            {{ games?.description }}
          </p>
        </ion-text>
      </section>
      <section class="map-container">
        <div @click="goToGoogleMapsLink" class="address-text">
          <p>
            {{ addressFromCoordinates }}
          </p>
        </div>
        <MapboxMap
          contries="no"
          language="no"
          style="height: 400px"
          :access-token="constants.MAPBOX_TOKEN"
          map-style="mapbox://styles/mapbox/streets-v11"
          :center="[
            games?.position.coordinates[0],
            games?.position.coordinates[1],
          ]"
          :zoom="5"
        >
          <MapboxMarker
            :lng-lat="[
              games?.position.coordinates[0],
              games?.position.coordinates[1],
            ]"
          />
        </MapboxMap>
      </section>
      <div class="hr-line" />
      <section class="comments-container-section">
        <ion-text class="ion-text-center">
          <h3>Kommentarer</h3>
        </ion-text>
        <ion-text
          class="comments-container"
          v-for="comments in games?.comments"
          :key="comments.id"
        >
          <div class="comments-text-container">
            <h6 style="font-weight: bold">
              {{ comments.user_created.first_name }}
              <span class="comment-date-span">{{
                new Date(comments.date_created).toLocaleString()
              }}</span>
            </h6>
            <p>{{ comments.content }}</p>
          </div>
          <div
            class="delete-icon-container"
            v-if="comments.user_created.id === currentUserId"
          >
            <ion-icon
              class="delete-comment-icon"
              :icon="trashOutline"
              @click="commentDelete(comments.id)"
            ></ion-icon>
          </div>
        </ion-text>
      </section>
      <ion-modal
        @did-dismiss="isModalOpen = false"
        :is-open="isModalOpen"
        :initial-breakpoint="0.25"
        :breakpoints="[0.0, 0.25, 0.5, 0.75]"
      >
        <ion-content>
          <ion-item lines="none">
            <ion-label position="stacked"></ion-label>
            <ion-textarea
              autocapitalize="sentences"
              placeholder="Hei, når kan jeg hente det?"
              v-model="newComment"
              @keyup.enter="sendCommentToDatabase($event)"
            ></ion-textarea>
            <ion-button
              @click="sendCommentToDatabase"
              :disabled="isUploadingComment"
              class="btn-add-comment"
              color="success"
              >Skriv til selger</ion-button
            >
          </ion-item>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
ion-icon {
  font-size: 1.7rem;
}
.map-container {
  border: 1px solid #252525;
  border-radius: 10px 10px 0 0;
  margin: 10px;
  display: flex;
  flex-direction: column;
}

.address-text {
  text-align: center;
  color: #3366cc;
  text-decoration: underline;
}

.condition-platform-container > * {
  padding: 0.1em;
  margin-inline: 5px;
  font-size: 1rem;
  font-weight: 700;
  width: fit-content;
  margin: 0;
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
}

.used {
  color: rgba(37, 37, 37, 0.58);
  font-family: Saira, monospace;
}

.description-container {
  text-align: left;
}

ion-title {
  font-size: 1.7rem;
}

ion-toolbar {
  font-family: VT323, sans-serif;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  --background: rgba(230, 230, 250, 0.7);
}

ion-content::part(background) {
  background: #e8e6dc;
}

.spinner {
  color: #252525;
  display: flex;
  margin: auto;
  width: 20%;
  height: 90vh;
}

.comments-container {
  display: flex;
  flex-direction: column;
}

.comments-text-container {
  display: flex;
  flex-direction: column;
}

.delete-icon-container {
  display: flex;
  align-self: flex-end;
}

.delete-comment-icon {
  color: #ff8080;
  font-size: 1.5rem;
}

.comment-date-span {
  color: #6b6b6b;
  font-family: "Arial", sans-serif;
  font-weight: lighter;
}

.btn-add-comment {
  font-size: 1rem;
}

.comments-container-section {
  margin: 20px;
}

.ul-properties-container-detail {
  position: relative;
  list-style: none;
  padding: 0;
}

.ul-properties-container-detail {
  display: flex;
  list-style: none;
  flex-direction: row;
  justify-content: center;
  position: relative;
  padding: 0;
  align-items: flex-start;
  gap: 10px;

  li {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 700;
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

.hr-line {
  border: 1px solid gray !important;
  visibility: visible !important;
}
</style>
