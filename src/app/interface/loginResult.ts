import { User } from './user';

export interface LoginResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}
