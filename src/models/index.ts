import { getCustomRepository } from 'typeorm';

import { LocalActorRepository } from './repositories/local-actor';
import { RemoteActorRepository } from './repositories/remote-actor';

export const LocalActors = getCustomRepository(LocalActorRepository);
export const RemoteActors = getCustomRepository(RemoteActorRepository);
