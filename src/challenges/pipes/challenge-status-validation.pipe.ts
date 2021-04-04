import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ChallengeStatus } from '../interfaces/challenge.enum';


export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly permittedStatus = [
    ChallengeStatus.ACEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELLED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if(!this.isValid(status)) {
      throw new BadRequestException(`${status} is not valid`)
    }
    return value
  }

  private isValid(status: any) {
    const idx = this.permittedStatus.indexOf(status);

    return idx !== -1;
  }
}