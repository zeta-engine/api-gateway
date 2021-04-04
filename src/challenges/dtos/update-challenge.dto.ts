import { IsOptional } from 'class-validator';
import { ChallengeStatus } from '../interfaces/challenge.enum';

export class UpdateChallengeDTO {
  @IsOptional()
  status: ChallengeStatus;
}
