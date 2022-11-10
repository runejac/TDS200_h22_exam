<script setup lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonItemGroup,
  IonIcon,
  IonLabel,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
  toastController,
} from "@ionic/vue";
import { Camera, CameraResultType } from "@capacitor/camera";
import { ref } from "vue";
import { directus } from "@/services/directus.service";
import { useRouter } from "vue-router";
import { trashOutline } from "ionicons/icons";
import { NewGame } from "@/types/types";

const router = useRouter();

const newPropertyText = ref("");
const isUploading = ref(false);

const newGame = ref<NewGame>({
  title: "",
  properties: [],
  description: "",
  image: "",
  price: "",
});

const chooseOrTakePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 100,
    allowEditing: true,
    resultType: CameraResultType.Uri,
  });

  if (image.webPath) {
    newGame.value.image = image.webPath;
  }
};

const addProperties = () => {
  if (newPropertyText.value) {
    newGame.value.properties.push(newPropertyText.value);
    newPropertyText.value = "";
  }
};

const sendImageBlobToDatabase = async (e: { preventDefault: () => void }) => {
  e.preventDefault();

  if (!newGame.value.image) {
    alert("Du må velge et bilde");
    return;
  }

  try {
    isUploading.value = true;
    const response = await fetch(newGame.value.image);
    const imageBlob = await response.blob();
    const formData = new FormData();
    formData.append("file", imageBlob);
    const file = await directus.files.createOne(formData);

    if (file?.type === "image/png" || file?.type === "image/jpeg") {
      await directus.items("games").createOne({
        title: newGame.value.title,
        properties: newGame.value.properties,
        description: newGame.value.description,
        price: newGame.value.price,
        image: file.id,
      });
      isUploading.value = false;
      const successToast = await toastController.create({
        message: "Lagt ut spill.",
        duration: 4000,
        color: "success",
      });
      await successToast.present();

      // resetting inputs
      newGame.value.title = "";
      newGame.value.image = "";
      newGame.value.description = "";
      newGame.value.price = "";
      newGame.value.properties = [];
      await router.replace("/browse");
    } else {
      const errorToast = await toastController.create({
        message: "Ops! Du må velge et bilde!",
        duration: 3000,
        color: "warning",
      });
      await errorToast.present();
    }
  } catch (e) {
    console.error(e);
  }
};

const removeImageChosen = () => {
  newGame.value.image = "";
};
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="ion-text-center">Nytt spill 🕹️</ion-title>
        <ion-buttons style="position: absolute" slot="start">
          <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form v-on:submit="sendImageBlobToDatabase">
        <section class="image-container">
          <div v-if="newGame.image" class="has-been-added-image-container">
            <div class="add-image">
              <img
                class="image-uploaded"
                :src="newGame.image"
                alt="image uploaded from gallery or storage"
                @click="chooseOrTakePicture"
              />
            </div>
            <ion-icon
              class="button-delete-image-chosen"
              @click="removeImageChosen"
              :icon="trashOutline"
            />
          </div>

          <div
            v-else
            class="will-be-added-image-container"
            @click="chooseOrTakePicture"
          >
            <div class="add-image">Last opp bilde</div>
          </div>
        </section>

        <div class="hashtag-container">
          <ul class="ul-hashtag-container-new">
            <li v-for="property in newGame.properties" :key="property">
              {{ property }}
            </li>
          </ul>
        </div>

        <div class="input-container">
          <ion-item-group>
            <ion-input
              inputmode="text"
              autocapitalize="sentences"
              class="input"
              v-model="newGame.title"
              required
              type="text"
              placeholder="Tittel"
            ></ion-input>
            <div class="properties-input-container">
              <ion-input
                class="input"
                inputmode="text"
                v-model="newPropertyText"
                type="text"
                placeholder="Tags"
              ></ion-input>
              <ion-button
                color="medium"
                class="btn-add-properties"
                slot="end"
                @click="addProperties"
                >+</ion-button
              >
            </div>
            <ion-input
              class="input"
              inputmode="numeric"
              v-model="newGame.price"
              type="number"
              required
              placeholder="Kr."
            >
            </ion-input>
            <ion-textarea
              placeholder="Beskrivelse"
              rows="4"
              inputmode="text"
              autocapitalize="sentences"
              class="input"
              v-model="newGame.description"
              required
            ></ion-textarea>
          </ion-item-group>
        </div>
        <div class="btn-add-container">
          <ion-button
            class="btn-add"
            :disabled="isUploading"
            type="submit"
            color="tertiary"
            >Legg til spill</ion-button
          >
        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
ion-content::part(background) {
  background: #e8e6dc;
}

.properties-input-container {
  display: inline-flex;
}

.input {
  margin: 0;
  padding: 0;
  font-size: 1rem;
  color: #000;
  background: #fff;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

ion-toolbar {
  --background: #2aa146;
  color: #e8e6dc;
}

ion-input {
  font-weight: 300;
  color: #252525;

  &:hover,
  &:focus {
    font-weight: 700;
    outline: 1px #252525 solid;
  }
}

ion-textarea {
  font-weight: 300;
  color: #252525;

  &:hover,
  &:focus {
    font-weight: 700;
    outline: 1px #252525 solid;
  }
}

ion-item-group {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ul-hashtag-container-new {
  position: relative;
  list-style: none;
  padding: 0;
  top: 30px;
  height: 12px;
}

.ul-hashtag-container-new > li {
  display: inline-block;
  background-color: #853eda;
  color: #ffffff;
  font-family: "Fira Code Medium", sans-serif;
  font-size: 0.9rem;
  border-radius: 20px;
  padding-inline: 8px;
  padding-block: 3px;
}

.btn-add-properties {
  align-self: center;
  margin-left: 15px;
  font-size: 1.3rem;
}

ion-button::part(native) {
  background: #2aa146;
  border-bottom: 6px inset rgba(0, 0, 0, 0.5);
  border-left: 6px inset rgba(0, 0, 0, 0.5);
  border-right: 6px inset rgba(255, 255, 255, 0.5);
  border-top: 6px inset rgba(255, 255, 255, 0.5);
  color: #e8e6dc;
  cursor: pointer;
  border-radius: 10px;
  font-size: 1.2rem;
  text-transform: uppercase;

  &:focus:active {
    background: #15e343;
  }
  /*  font-family: "Fira Code Medium", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  background-color: #2aa146;
  border-radius: 0;
  padding: 10px 20px;
  margin: 0;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #2aa146;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
  }

  &:active {
    background-color: #2aa146;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
  }*/
}

/*ion-button.btn-add-properties::part(native) {
  --background: #2aa146;
}*/

.input-container {
  margin-top: 4rem;
  display: flex;
  width: 90%;
}

.image-container {
  margin-top: 3rem;
  width: 90%;
}

.will-be-added-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px dashed #c2c2c2;
  border-radius: 10px;
  height: 180px;
}

.has-been-added-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 180px;
}

.button-delete-image-chosen {
  position: absolute;
  display: flex;
  justify-content: center;
  align-self: flex-end;
  top: 270px;
  color: #ff8080;
  font-size: 2rem;
}

.btn-add-container {
  margin-top: 70px;
  width: 90%;
}

.btn-add {
  display: flex;
  font-size: 1rem;
}

.add-image {
  font-size: 1.7rem;
  font-family: "Fira Code Medium", sans-serif;
}

.image-uploaded {
  max-height: 250px;
  max-width: 300px;
  border-radius: 10px;
}
</style>
