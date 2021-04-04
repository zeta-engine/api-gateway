export interface Player {
  readonly _id: string;
  readonly phoneNumber: string;
  readonly email: string;
  category: string;
  name: string;
  ranking: string;
  rankingPosition: number;
  imageUrl: string;
}