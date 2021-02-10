import { IObject, IOrderedCollection } from '../type';

/**
 * Render OrderedCollection
 * @param id URL of self
 * @param totalItems Total number of items
 * @param first URL of first page (optional)
 * @param last URL of last page (optional)
 * @param orderedItems attached objects (optional)
 */
export function renderOrderedCollection(id: string | null, totalItems?: number, first?: string | null, last?: string | null, orderedItems?: IObject[] | null): IOrderedCollection {
	const collection = {
		id,
		type: 'OrderedCollection',
		totalItems: totalItems || 0,
	} as IOrderedCollection;

	if (first) collection.first = first;
	if (last) collection.last = last;
	if (orderedItems) collection.orderedItems = orderedItems;

	return collection;
}