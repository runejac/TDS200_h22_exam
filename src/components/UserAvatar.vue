<script setup lang="ts">
import { IonImg } from "@ionic/vue";
import { Ref } from "vue";

interface PropsFromBrowsePageToAvatar {
  isLoading: boolean;
  avatarDummy: string;
  currentUserAvatar: Ref<string>;
}

defineProps<PropsFromBrowsePageToAvatar>();
</script>

<template>
  <ion-img
    :src="!isLoading ? currentUserAvatar : avatarDummy"
    alt="image of dummy avatar loading"
  />
</template>

<style scoped lang="scss">
ion-img::part(image) {
  border-radius: 100%;
  border: 2px solid #252525;
}
</style>
