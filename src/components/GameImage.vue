<script setup lang="ts">
import { constants } from "@/constants/constants";
import { IonImg, IonText } from "@ionic/vue";

interface PropsFromCardToImage {
  imageId: string;
  gamePrice: string;
}

defineProps<PropsFromCardToImage>();

const userAccessToken = localStorage.getItem("auth_token");
</script>

<template>
  <div>
    <p>{{ gamePrice }} kr</p>
    <ion-img
      :src="`${constants.DIRECTUS_INSTANCE}/assets/${imageId}?access_token=${userAccessToken}`"
      alt="img of game"
    />
  </div>
</template>

<style scoped lang="scss">
div {
  position: relative;
}
p {
  font-family: "Arial", monospace;
  position: absolute;
  bottom: 4px;
  right: 4px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.56);
  color: white;
  padding: 0.5rem;
  font-size: 1rem;
  margin: 0;
}
</style>
