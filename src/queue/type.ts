import * as httpSignature from 'http-signature';
import { SignedActivity } from '../activitypub/types';

export type DeliverJobData = {
	/** Activity */
	content: SignedActivity;
	/** inbox URL to deliver */
	to: string;
};

export type InboxJobData = {
	activity: SignedActivity;
	signature: httpSignature.IParsedSignature;
};
