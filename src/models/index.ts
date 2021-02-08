import { getCustomRepository } from 'typeorm';

import { LocalActorRepository } from './repositories/local-actor';

export const LocalActors = getCustomRepository(LocalActorRepository);
