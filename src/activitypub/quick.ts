// デファクトでまあいけるルーチン
// 厳密にはLinkをリモート解決する必要があるが、まあしなくても問題ないものたち

import { IEmoji, IHashtag, IObject, isEmoji, isObject, isHashtag, extractIdNullable, extractId } from './types';

/**
 * とりあえずなんでも配列であることを保証する関数
 */
export function toArray<T>(x: T | T[] | null | undefined): T[] {
	if (x == null) return [];
	return Array.isArray(x) ? x : [x];
}

/**
 * とりあえず最初の値を取る関数
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function toSingle<T>(x: T | T[] | null | undefined): T | null | undefined {
	if (x == null) return x;
	return Array.isArray(x) ? x[0] : x;
}

/**
 * filterに入れてnull | undefined以外を取り出すためのfunction
 */
export function isNonNull<T>(x: T | null | undefined): x is T {
	return x != null;
}

/**
 * 解釈されたカスタム絵文字情報
 */
export type ParsedEmoji = {
	/** 文字名 (:name:) */
	name: string;
	/** URL */
	url: string;
	/** 最終更新日時 */
	updated?: Date;
}

/**
 * オブジェクトからカスタム絵文字を取得して { name: ':name:', url '...' }[] みたいにします
 */
export function extractEmojis(object: IObject): ParsedEmoji[] {
	/*
	 なんらかのObjectやActivityからカスタム絵文字情報を抽出します。
	 通常MastdonではActor/Post系Objectに、Misskeyでは追加でLike Activityに含まれています。
	 ただ、この関数はどのようなObjectやActivityでも抽出出来るようになっています。
	 なお、Link等でリモート解決が必要な場合は常に無視します。
	*/

	const toEmoji = (x: IEmoji) => {
		if (x.name != null && isObject(x.icon) && typeof x.icon?.url === 'string') {
			return {
				name: x.name,
				url: x.icon.url
			}
		} else {
			return null;
		}
	};

	return toArray(object.tag).filter(isObject).filter(isEmoji).map(toEmoji).filter(isNonNull);
}

/**
 * オブジェクトからハッシュタグを取得して '#tag'[] みたいにします
 */
export function extractHashTags(object: IObject): string[] {
	const toHashtag = (x: IHashtag) => {
		if (x.name != null) {
			return x.name
		} else {
			return null;
		}
	};

	return toArray(object.tag).filter(isObject).filter(isHashtag).map(toHashtag).filter(isNonNull);
}

type visibilityInfo = {
	visibility: 'public' | 'home' | 'followers' | 'direct';
	mentions: string[];
}

export function determineVisibility(object: IObject): visibilityInfo {
	const to = toArray(object.to).map(extractId);
	const cc = toArray(object.cc).map(extractId);
	const bto = toArray(object.bto).map(extractId);
	const bcc = toArray(object.bcc).map(extractId);

	const publics = [ 'https://www.w3.org/ns/activitystreams#Public', 'as#Public', 'Public' ];
	const followers: string[] = [];

	const attributedTo = extractIdNullable(toSingle(object.attributedTo));
	if (attributedTo) followers.push(`${attributedTo}/followers`);

	const v: visibilityInfo = { visibility: 'direct', mentions: [] };

	if (to.some(x => publics.includes(x))) {
		v.visibility = 'public';
	} else if (cc.some(x => publics.includes(x))) {
		v.visibility = 'home';
	} else if (to.some(x => followers.includes(x))) {
		v.visibility = 'followers';
	}

	v.mentions = to.concat(cc).concat(bto).concat(bcc).filter(x => !publics.includes(x) && !followers.includes(x));

	return v;
}
