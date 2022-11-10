<script setup lang="ts">
import { IonImg } from "@ionic/vue";
import { authService } from "@/services/directus.service";
import { constants } from "@/constants/constants";
import { ref } from "vue";

const currentUserAvatar = ref();
const isLoading = ref(true);
const avatarDummy = "assets/img/avatar-dummy.png";

const getCurrentUserDetails = async () => {
  const userAccessToken = localStorage.getItem("auth_token");
  const currentUserResponse = await authService.currentUser();

  if (currentUserResponse.avatar) {
    currentUserAvatar.value = `${constants.DIRECTUS_INSTANCE}/assets/${currentUserResponse.avatar}?access_token=${userAccessToken}`;
    isLoading.value = false;
  }
};

getCurrentUserDetails();
</script>

<template>
  <ion-img
    :src="!isLoading ? currentUserAvatar : avatarDummy"
    alt="image of dummy avatar loading"
  />
</template>

<style scoped lang="scss">
ion-img::part(image) {
  border-radius: 100px;
}
</style>
