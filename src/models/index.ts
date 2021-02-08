import { getCustomRepository } from 'typeorm';

import { LocalActorRepository } from './repositories/local-actor';

export const Users = getCustomRepository(LocalActorRepository);
