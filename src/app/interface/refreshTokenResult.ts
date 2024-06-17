import { User } from './user';

export interface RefreshTokenResult {
  user: User;
  accessToken: string;
}
