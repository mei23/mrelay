import { IObject, IOrderedCollectionPage, Link } from "../type";

/**
 * Render OrderedCollectionPage
 * @param id URL of self
 * @param totalItems Number of total items
 * @param orderedItems Items
 * @param partOf URL of base
 * @param prev URL of prev page (optional)
 * @param next URL of next page (optional)
 */
export default function(id: string, totalItems: number, orderedItems: (IObject | Link)[], partOf: string, prev?: string | null, next?: string | null): IOrderedCollectionPage {
	const page = {
		id,
		partOf,
		type: 'OrderedCollectionPage',
		totalItems,
		orderedItems
	} as IOrderedCollectionPage;

	if (prev) page.prev = prev;
	if (next) page.next = next;

	return page;
}
