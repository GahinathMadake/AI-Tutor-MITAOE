import * as stytch from 'stytch';
import { config } from './config';

export const stytchClient = new stytch.Client({
  project_id: config.STYTCH_PROJECT_ID,
  secret: config.STYTCH_SECRET,
  env: config.NODE_ENV === 'production' 
    ? stytch.envs.live 
    : stytch.envs.test,
});