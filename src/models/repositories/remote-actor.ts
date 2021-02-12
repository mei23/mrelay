import { EntityRepository, Repository } from 'typeorm';
import { RemoteActor } from '../entities/remote-actor';

@EntityRepository(RemoteActor)
export class RemoteActorRepository extends Repository<RemoteActor> {
}
