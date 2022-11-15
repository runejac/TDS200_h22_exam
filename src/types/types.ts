interface Games {
  id: number;
  title: string;
  description: string;
  properties: string[];
  condition: string;
  platform: string;
  comments?: [
    {
      id: number;
      content: string;
      date_created: string;
      user_created: { id: string; first_name: string };
    }
  ];
  date_created: string;
  price: string;
  position: { type: string; coordinates: number[] };
  image: { id: string };
  user_created: { id: string; first_name: string };
}

interface GamesResponse {
  games: Games[];
}

interface GameResponseDetails {
  games_by_id: Games[];
}

interface NewGame {
  title: string;
  properties: string[];
  description: string;
  image: string;
  price: string;
  condition: string;
  platform: string;
  position: { type: string; coordinates: number[] };
}

interface PositionCoordinates {
  longitude: number;
  latitude: number;
}

export {
  Games,
  GameResponseDetails,
  GamesResponse,
  NewGame,
  PositionCoordinates,
};
