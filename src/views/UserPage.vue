<script setup lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonCardContent,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
  toastController,
} from "@ionic/vue";
import { authService, directus } from "@/services/directus.service";
import { trashOutline } from "ionicons/icons";
import { Games, GamesResponse } from "@/types/types";
import { ref } from "vue";
import UserAvatar from "@/components/UserAvatar.vue";
import GameImage from "@/components/GameImage.vue";
import { useRouter } from "vue-router";
import { constants } from "@/constants/constants";

const router = useRouter();
const isLoadingData = ref(true);
const retroGames = ref<Games[]>();
const currentUserId = ref();
const currentUserFirstname = ref();
const currentUserAvatar = ref();
const isLoading = ref(false);
const avatarDummy = "assets/img/avatar-dummy.png";

onIonViewDidEnter(async () => {
  await getCurrentUserDetails();
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
        date_created
        user_created {
          first_name
          id
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

const gameDelete = async (gameId: number) => {
  const confirmedDeletion = confirm(
    "Er du sikker på at du vil fjerne dette spillet fra din samling?"
  );

  if (confirmedDeletion) {
    try {
      await directus.items("games").deleteOne(gameId);
      const successToast = await toastController.create({
        message: "Spill fjernet fra din samling.",
        duration: 2000,
        color: "warning",
      });
      await successToast.present();
      await gameQuery();
    } catch (e) {
      console.error(e);
    }
  }
};

const logOut = async (messageToGuest?: string) => {
  await authService.logout();

  const loggedOutToast = await toastController.create({
    // if user is the guest user, messageToGuest will be used.
    message: messageToGuest ? messageToGuest : "Du er logget ut.",
    duration: 3000,
    color: "success",
  });

  await loggedOutToast.present();
  await router.replace("/");
};

const goToGameDetails = (gameId: number) => {
  router.push(`/detail/${gameId}`);
};

const logOutOfGuestAndRouteToStart = async () => {
  await logOut("Klikk på 'Registrer'");
};

const getCurrentUserDetails = async () => {
  const userAccessToken = localStorage.getItem("auth_token");
  const currentUserResponse = await authService.currentUser();

  currentUserFirstname.value = currentUserResponse.first_name;
  currentUserId.value = currentUserResponse.id;

  if (currentUserResponse.avatar) {
    currentUserAvatar.value = `${constants.DIRECTUS_INSTANCE}/assets/${currentUserResponse.avatar}?access_token=${userAccessToken}`;
    isLoading.value = true;
  }
};

const doRefresh = async (e: { target: { complete: () => void } }) => {
  await getCurrentUserDetails();
  await gameQuery();
  e.target.complete();
};
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="ion-text-center">
          Oversikt, {{ currentUserFirstname }}
        </ion-title>
        <ion-buttons style="position: absolute" slot="start">
          <ion-back-button default-href="/browse"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="user-avatar-container">
        <user-avatar
          class="user-avatar"
          :avatar-dummy="avatarDummy"
          :is-loading="isLoading"
          :current-user-avatar="currentUserAvatar"
        />
      </div>
      <div
        class="games-container"
        v-if="currentUserId !== constants.GUEST_USER_ID"
      >
        <ion-text>
          <h3>Dine artikler</h3>
        </ion-text>
        <section>
          <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
          </ion-refresher>
          <div v-for="game in retroGames" :key="game.id">
            <ion-card v-if="currentUserId === game.user_created.id">
              <game-image
                @click="goToGameDetails(game.id)"
                class="game-image"
                :game-price="game.price"
                :image-id="game.image.id"
              />
              <ion-card-header>
                <div class="title-delete-container">
                  <ion-card-title @click="goToGameDetails(game.id)">{{
                    game.title
                  }}</ion-card-title>
                  <ion-icon
                    class="delete-comment-icon"
                    :icon="trashOutline"
                    @click="gameDelete(game.id)"
                  ></ion-icon>
                </div>
                <ion-card-subtitle>
                  Aktiv siden:
                  {{
                    new Date(game.date_created).toLocaleDateString()
                  }}</ion-card-subtitle
                >
              </ion-card-header>
            </ion-card>
          </div>
        </section>
      </div>
      <div
        v-if="currentUserId === constants.GUEST_USER_ID"
        class="not-logged-in-container"
      >
        <ion-text>
          <h1>Kjære gjest</h1>
          <p>
            Du må opprette en konto for å kjøpe og selge spill. Trykk på
            <br /><span>"Rykk tilbake til start"</span> for å registrere deg.
          </p>
        </ion-text>
        <ion-buttons class="btn-start-container">
          <ion-button class="btn-start" @click="logOutOfGuestAndRouteToStart"
            >Rykk tilbake til start</ion-button
          >
        </ion-buttons>
      </div>
      <ion-buttons
        v-if="currentUserId !== constants.GUEST_USER_ID"
        class="btn-logout-container"
      >
        <ion-button class="btn-logout" @click="logOut(null)"
          >Logg ut</ion-button
        >
      </ion-buttons>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
.title-delete-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.delete-comment-icon {
  color: #ff8080;
  font-size: 1.5rem;
  position: relative;
}

ion-card-title {
  font-family: VT323, monospace;
  font-size: 1.5rem;
}

ion-content::part(background) {
  background: #e8e6dc;
}

.not-logged-in-container {
  color: #252525;
  display: flex;
  flex-direction: column;
  margin: 20px;

  ion-text {
    text-align: center;
    span {
      font-weight: bold;
    }
  }
}

.user-avatar-container {
  margin: 20px;
  display: flex;
  justify-content: center;
}

.user-avatar {
  width: 100px;
}

.games-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-image {
  max-height: 100px;
  max-width: 35%;
}

ion-card {
  display: flex;
  flex-direction: row;
  outline: 1px solid black;
  box-shadow: 0.7rem 0.7rem black;
  color: #252525;
  border-radius: 0;
  width: 90%;
  font-weight: bold;
  font-size: 0.8rem;
  background: #e8e6dc;
}

.btn-start-container {
  display: flex;
  justify-content: center;
  margin: 20px;
}

.btn-start {
  width: 100%;
  background: #252525;
  color: #e8e6dc;
  font-weight: bold;
  font-size: 1rem;
}

section {
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.btn-logout-container {
  display: flex;
  position: fixed;
  margin: 20px;
  bottom: 0;
  left: 0;
}

.btn-logout {
  display: flex;
  position: relative;
  margin: 0;
  border-bottom: 2px #ef6f6c solid;
}

.btn-logout::part(native) {
  font-family: VT323, monospace;
  font-size: 1.5rem;
  font-weight: 300;
  color: #ef6f6c;
}
</style>
