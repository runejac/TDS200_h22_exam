<script setup lang="ts">
import { IonImg } from "@ionic/vue";
import { Ref } from "vue";

interface PropsFromBrowsePageToAvatar {
  isLoading: boolean;
  avatarDummy: string;
  currentUserAvatar: Ref<string>;
}

/**jeg har disse props fra browsepage og userpage og ikke her
 * i komponenten, for opplevde at de var avhengig av
 * onIonViewDidEnter og det fungerte ikke her inne i en komponent*/

defineProps<PropsFromBrowsePageToAvatar>();
</script>

<template>
  <ion-img
    :src="isLoading ? currentUserAvatar : avatarDummy"
    alt="image of avatar"
  />
</template>

<style scoped lang="scss">
ion-img::part(image) {
  border-radius: 100%;
}
</style>
