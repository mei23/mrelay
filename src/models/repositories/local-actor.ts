import { EntityRepository, Repository } from 'typeorm';
import { LocalActor } from '../entities/local-actor';

@EntityRepository(LocalActor)
export class LocalActorRepository extends Repository<LocalActor> {
}
