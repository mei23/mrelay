export type obj = { [x: string]: any };

export type AsObject = IObject | string | (IObject | string)[];

export interface IObject {
	'@context'?: string | obj | obj[];
	type: string | string[];
	id?: string;
	published?: string;
	to?: AsObject;
	cc?: AsObject;
	attributedTo?: AsObject;
}

export interface IActivity extends IObject {
	actor?: AsObject;
	object?: AsObject;
	target?: AsObject;
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
	type: 'Person' | 'Service' | 'Organization' | 'Group' | 'Application';
	inbox: IOrderedCollection | string;
	outbox: IOrderedCollection | string;
	following?: IOrderedCollection | ICollection | string;
	followers?: IOrderedCollection | ICollection | string;
	preferredUsername?: string;
	sharedInbox?: string;

	publicKey?: {
		id?: string;
		owner?: string;
		publicKeyPem?: string;
	};
}

export interface ICollection extends IObject {
	type: 'Collection';
	totalItems: number;
	items?: AsObject;
	current?: ICollectionPage;
	first?: ICollectionPage;
	last?: ICollectionPage;
}

export interface ICollectionPage extends IObject {
	type: 'CollectionPage';
	totalItems: number;
	items?: (IObject | string)[];
	current?: ICollectionPage;
	first?: ICollectionPage;
	last?: ICollectionPage;	partOf: string;
	next?: ICollectionPage;
	prev?: ICollectionPage;
}

export interface IOrderedCollection extends IObject {
	type: 'OrderedCollection';
	totalItems: number;
	orderedItems?: (IObject | string)[];
	current?: IOrderedCollectionPage;
	first?: IOrderedCollectionPage;
	last?: IOrderedCollectionPage;
}

export interface IOrderedCollectionPage extends IObject {
	type: 'OrderedCollectionPage';
	totalItems: number;
	orderedItems?: (IObject | string)[];
	current?: IOrderedCollectionPage;
	first?: IOrderedCollectionPage;
	last?: IOrderedCollectionPage;
	partOf: string;
	next?: IOrderedCollectionPage;
	prev?: IOrderedCollectionPage;
	startIndex?: number;
}