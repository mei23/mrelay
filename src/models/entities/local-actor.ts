// The local user
import { Entity, Column, Index, PrimaryColumn } from 'typeorm';
import { id } from '../id';

@Entity()
@Index(['usernameLower'], { unique: true })
export class LocalActor {
	@PrimaryColumn(id())
	public id: string;

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
		length: 4096,
	})
	public privateKey: string;

	constructor(data: Partial<LocalActor>) {
		if (data == null) return;

		for (const [k, v] of Object.entries(data)) {
			(this as any)[k] = v;
		}
	}
}
