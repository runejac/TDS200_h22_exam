<script setup lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
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
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="ion-text-center">TESTHALLO?</ion-title>
        <ion-buttons style="position: absolute" slot="start">
          <ion-back-button default-href="/browse">Tilbake</ion-back-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-buttons slot="end">
        <ion-button>
          <ion-icon></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-header>

    <ion-content> HLLOWORLd?! </ion-content>
  </ion-page>
</template>

<style scoped lang="scss"></style>
