import { Player } from "../../players/interfaces/player.interface";
import { ChallengeStatus } from "./challenge.enum";

export interface Challenge extends Document {
  datetime: Date,
  status: ChallengeStatus,
  datetimeRequest: Date,
  datetimeResponse: Date,
  requester: Player,
  category: string,
  players: Array<Player>,
  match?: string,
}