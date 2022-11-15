<script setup lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItemGroup,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
  toastController,
} from "@ionic/vue";
import { Camera, CameraResultType } from "@capacitor/camera";
import { ref } from "vue";
import { directus } from "@/services/directus.service";
import { useRouter } from "vue-router";
import { trashOutline } from "ionicons/icons";
import { NewGame } from "@/types/types";
import { Geolocation } from "@capacitor/geolocation";

const router = useRouter();
const newPropertyText = ref("");
const isUploading = ref(false);

onIonViewDidEnter(async () => {
  await getCurrentPosition();
});

const newGame = ref<NewGame>({
  title: "",
  properties: [],
  description: "",
  image: "",
  price: "",
  condition: "",
  position: {
    type: "Point",
    coordinates: [0, 0],
  },
  platform: "",
});

const getCurrentPosition = async () => {
  // bruker posisjonen til bruker som er logget inn
  const checkPermission = await Geolocation.checkPermissions();

  console.log(checkPermission);

  const requestPermission = await Geolocation.requestPermissions();

  console.log(requestPermission);

  const coordinates = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
  });
  newGame.value.position.coordinates = [
    coordinates.coords.longitude,
    coordinates.coords.latitude,
  ];

  console.log("longitude", newGame.value.position.coordinates[0]);
  console.log("latitude", newGame.value.position.coordinates[1]);
};

const chooseOrTakePicture = async () => {
  // velger bilde fra gallery eller tar nytt bilde
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
  // legger til egenskaper i arrayet
  if (newPropertyText.value) {
    newGame.value.properties.push(newPropertyText.value);
    newPropertyText.value = "";
  }
};

const insertGameToDb = async (e: { preventDefault: () => void }) => {
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

    // filtypen må være bilde for å gå videre
    if (file?.type === "image/png" || file?.type === "image/jpeg") {
      await directus.items("games").createOne({
        title: newGame.value.title,
        properties: newGame.value.properties,
        description: newGame.value.description,
        price: newGame.value.price,
        image: file.id,
        condition: newGame.value.condition,
        position: newGame.value.position,
        platform: newGame.value.platform,
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
      newGame.value.condition = "";
      newGame.value.platform = "";
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
      <form v-on:submit="insertGameToDb">
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
            <div class="add-image">Velg bilde</div>
          </div>
        </section>

        <ul class="ul-properties-container-new">
          <li
            class="properties"
            v-for="property in newGame.properties"
            :key="property"
          >
            {{ property }}
          </li>
        </ul>

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
                placeholder="Stikkord"
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
            <ion-select
              class="input"
              v-model="newGame.condition"
              placeholder="Tilstand"
              required
            >
              <ion-select-option value="Ny">Ny</ion-select-option>
              <ion-select-option value="Brukt">Brukt</ion-select-option>
              <ion-select-option value="Mint Condition"
                >Mint Condition</ion-select-option
              >
            </ion-select>
            <ion-select
              class="input"
              v-model="newGame.platform"
              placeholder="Konsoll"
              required
            >
              <ion-select-option value="NES">NES</ion-select-option>
              <ion-select-option value="Super NES Classic"
                >Super NES Classic</ion-select-option
              >
              <ion-select-option value="Sega Genesis"
                >Sega Genesis</ion-select-option
              >
              <ion-select-option value="Capcom Home Arcade"
                >Capcom Home Arcade</ion-select-option
              >
              <ion-select-option value="Atari 2600"
                >Atari 2600</ion-select-option
              >
              <ion-select-option value="Game Boy">Game Boy</ion-select-option>
              <ion-select-option value="Game Boy Color"
                >Game Boy Color</ion-select-option
              >
              <ion-select-option value="Playstation Classic"
                >Playstation Classic</ion-select-option
              >
            </ion-select>
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
ion-select {
  height: 40px;
}

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

ion-input,
ion-textarea,
ion-select {
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

.ul-properties-container-new {
  position: relative;
  list-style: none;
  padding: 0;
  top: 30px;
  height: 12px;

  li {
    display: inline-block;
    color: #252525;
    background-image: linear-gradient(
      to right,
      rgba(105, 96, 31, 0.1),
      #f8d034 10%,
      rgba(255, 225, 0, 0.3)
    );
    font-family: "Fira Code Medium", sans-serif;
    font-size: 0.9rem;
    border-radius: 20px;
    padding-inline: 8px;
    padding-block: 3px;
  }
}

.btn-add-properties {
  margin-left: 15px;
  font-family: "Fira Code", monospace;
  font-size: 1.2rem;
}

ion-button::part(native) {
  background: #2aa146;
  border-bottom: 6px inset rgba(0, 0, 0, 0.5);
  border-left: 6px inset rgba(0, 0, 0, 0.5);
  border-right: 6px inset rgba(255, 255, 255, 0.5);
  border-top: 6px inset rgba(255, 255, 255, 0.5);
  color: #e8e6dc;
  text-transform: uppercase;

  &:focus:active {
    background: #15e343;
  }
}

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
  margin-block: 70px;
  width: 90%;
}

.btn-add {
  display: flex;
  height: 45px;
  font-family: VT323, monospace;
  font-size: 1.5rem;
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
