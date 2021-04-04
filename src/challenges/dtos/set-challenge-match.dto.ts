import { IsNotEmpty } from 'class-validator';
import { Player } from '../../players/interfaces/player.interface';
import { Result } from '../interfaces/match.interface';


export class SetChallengeMatchDTO {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Array<Result>;
}
