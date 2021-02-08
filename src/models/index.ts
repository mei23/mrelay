import { getCustomRepository } from 'typeorm';

import { LocalActorRepository } from './repositories/local-acotor';

export const Users = getCustomRepository(LocalActorRepository);
