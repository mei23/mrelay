// The remote user
import { Entity, Column, Index, PrimaryColumn } from 'typeorm';
import { id } from '../id';

@Entity()
@Index(['uri'], { unique: true })
export class RemoteActor {
	@PrimaryColumn(id())
	public id: string;

	@Column('timestamp with time zone', {
		comment: 'The created date of the User.'
	})
	public createdAt: Date;

	@Column('timestamp with time zone', {
		comment: 'The updated date of the User.'
	})
	public updatedAt: Date;

	@Column('timestamp with time zone', {
	})
	public lastFetchedAt: Date;

	@Column('varchar', {
		length: 128,
		comment: 'The username of the User.'
	})
	public username: string;

	@Column('varchar', {
		length: 128, select: false,
		comment: 'The username (lowercased) of the User.'
	})
	public usernameLower: string;

	@Column('varchar', {
		length: 4096,
	})
	public publicKey: string;

	@Column('varchar', {
		length: 256,
		comment: 'The host of the User'
	})
	public host: string;

	@Column('varchar', {
		length: 512,
		comment: 'The inbox URL of the User'
	})
	public inbox: string;

	@Column('varchar', {
		length: 512, nullable: true,
		comment: 'The sharedInbox URL of the User'
	})
	public sharedInbox: string | null;

	@Column('varchar', {
		length: 512,
		comment: 'The URI of the User'
	})
	public uri: string;

	constructor(data: Partial<RemoteActor>) {
		if (data == null) return;

		for (const [k, v] of Object.entries(data)) {
			(this as any)[k] = v;
		}
	}
}
