export type obj = { [x: string]: any };

export type AsObject = IObject | Link | (IObject | Link)[];

export type Link = string | ILink;

export interface ILink {
	type: 'Link';
	href: string;
	// TODO
};

export const isLink = (object: IObject): object is ILink => object.type === 'Link';

export interface IObject {
	'@context'?: string | obj | obj[];
	type: string | string[];
	id?: string;
	published?: Date;
	to?: AsObject;
	cc?: AsObject;
	attributedTo?: AsObject;
	// TODO
}

export function extractType(object: IObject): string {
	return typeof object.type === 'string' ? object.type : object.type[0];
}

export function extractId(x: IObject | Link): string {
	const id = typeof x === 'string' ? x : isLink(x) ? x.href : x.id;
	if (id == null) throw 'no id';
	return id;
}

export interface IActivity extends IObject {
	actor?: AsObject;
	object?: AsObject;
	target?: AsObject;

	/* Linked Data Signatures */
	signature?: {
		type: string;
		created: Date;
		creator: string;
		domain?: string;
		nonce?: string;
		signatureValue: string;
	};
}

export interface IActor extends IObject {
	// https://www.w3.org/TR/activitypub/#actor-objects
	type: 'Person' | 'Service' | 'Organization' | 'Group' | 'Application';
	inbox: IOrderedCollection | Link;
	outbox: IOrderedCollection | Link;
	following?: IOrderedCollection | ICollection | Link;
	followers?: IOrderedCollection | ICollection | Link;
	preferredUsername?: string;
	endpoints?: {
		sharedInbox?: IOrderedCollection | Link;
	};

	// https://docs.joinmastodon.org/spec/activitypub/#public-key
	publicKey?: {
		id?: string;
		owner?: string;
		publicKeyPem?: string;
	};
}

export interface ICollection extends IObject {
	type: 'Collection';
	totalItems: number;
	items?: (IObject | Link)[];
	current?: ICollectionPage | Link;
	first?: ICollectionPage | Link;
	last?: ICollectionPage | Link;
}

export interface ICollectionPage extends IObject {
	type: 'CollectionPage';
	totalItems: number;
	items?: (IObject | Link)[];
	current?: ICollectionPage | Link;
	first?: ICollectionPage | Link;
	last?: ICollectionPage | Link;
	partOf: ICollectionPage | Link;
	next?: ICollectionPage | Link;
	prev?: ICollectionPage | Link;
}

export interface IOrderedCollection extends IObject {
	type: 'OrderedCollection';
	totalItems: number;
	orderedItems?: (IObject | Link)[];
	current?: IOrderedCollectionPage | Link;
	first?: IOrderedCollectionPage | Link;
	last?: IOrderedCollectionPage | Link;
}

export interface IOrderedCollectionPage extends IObject {
	type: 'OrderedCollectionPage';
	totalItems: number;
	orderedItems?: (IObject | Link)[];
	current?: IOrderedCollectionPage | Link;
	first?: IOrderedCollectionPage | Link;
	last?: IOrderedCollectionPage | Link;
	partOf: IOrderedCollectionPage | Link;
	next?: IOrderedCollectionPage | Link;
	prev?: IOrderedCollectionPage | Link;
	startIndex?: number;
}