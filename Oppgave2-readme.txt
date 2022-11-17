Emulator: Android, Pixel 5 API 31

Bakgrunnsbilde brukt på login er fra Unsplash.com: https://unsplash.com/photos/ezEn4jYrVYQ
MULIG at man må klikke på register 2 ganger, dette er om du velger avatar. Mer info om dette står kommentert i directus.service.ts

Hvis du vil logge på en bruker som allerede har noen spill:
mail: rt@rt.com
passord: 1

Eller
mail: r@r.com
passord: 1

Funksjonalitet:
- Besøk app med gjestebruker som KUN har lese rettigheter på Games tabellen ved å klikke på "Gjestebruker" på /authentication
- Registrere ny bruker, med avatar i registreringsvindu
- Logge inn som registrert bruker
- Får opp spill listet i grid oversikt
- Kan klikke på et spill og få opp modal, hvor man kan klikke seg videre til med detaljer/kontakt selger -siden
- Kan klikke på avatarbilde øverst til høyre for å gå til user-siden, hvor user sine spill som ligger ute er listet opp
- Kan gå videre derfra til detaljsiden
- Kan slette sine spill fra markedet fra user-siden
- User kan legge til kommentarer/spørsmål til selger på detalj-siden, og slette de
- Postes lokasjon til selger når selger publiserer nytt spill i appen
- Kan vise hvor selgers posisjon er ved å se på kart
- Kan vise adressen til selger

### Minstekrav til implementasjon (fra oppgaveteksten):
- [x] Et brukersystem må være på plass, med andre ord må brukerne av appen ha mulighet til å registrere seg, logge inn og logge ut.
- [x] Kun innloggede brukere skal kunne legge til nye annonser. Gjester (ikke-innloggede brukere) skal kunne se publiserte annonser.
- [x] Presentere en oversikt over alle annonser som er tilgjengelig. Dette kan for eksempel være i liste- eller grid-format.
- [x] Hver annonse må det gå an å trykke seg inn på for å få mer informasjon (se pkt. 4-5 i tabellen fra oppgave 1)

### Eksempler på funksjonalitet som kan heve karakter (fra oppgaveteksten):
- [x] Innslag av eget design med retro(spill)-tema.
- [x] Gi brukeren mulighet til å søke i- og/eller filtrere annonser på markedsplassen.
- [ ] Kommunikasjon mellom brukere, f.eks. meldingssystem mellom selger og mulig kjøper.
- [x] «Spørsmål og svar»-seksjon / kommentarfelt inne på enkelt-annonse.
- [x] Kamera (Capacitor Camera) for å ta bilder av salgsobjektet.
- [ ] Mer enn ett bilde per annonse hvor man enten kan sveipe gjennom bilder, eller se bildene i et «galleri» i annonsen.
- [x] Fillagring via Directus, for lagring av blant annet bilder.
- [x] GPS (Capacitor Geolocation) for å hente ut hvor selger befinner seg i landet.
- [x] Bruk av Google Maps, Mapbox eller annen kartleverandør for å vise selgers lokasjon.
- [x] Tilbakemeldinger/feedback ved bruker-interaksjon (feilmeldinger, loading-spinnere, m.m.).
- [x] Egen profilside for innlogget bruker.
- [x] Bruk av npm-moduler (npm install [pakkenavn] –-save) (rimraf, prettier, sass, sass-loader, ionicons, studiometa/vue-mapbox-gl).
- [x] Bruk av relevante eksterne API-er (REST/GraphQL).
- [x] Implementasjon av accessibility-prinsipper. (Egen kommentar: ikke noe særlig bruk av aria label osv, men har alt tekster på bilder.)


