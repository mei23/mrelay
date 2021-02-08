import { ulid } from 'ulid';

export function genId(date?: Date): string {
	if (!date || (date > new Date())) date = new Date();
	return ulid(date.getTime());
}
