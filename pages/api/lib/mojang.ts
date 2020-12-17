import got from 'got';
import {IMojangProfile, IMojangName} from '../../../lib/types';

export const getProfileByUUID = async (uuid: string) => {
	return got.get(`https://api.mojang.com/user/profile/${uuid}`).json<IMojangProfile>();
};

export const getProfileByName = async (name: string): Promise<IMojangName | null> => {
	const res = await got.get(`https://api.mojang.com/users/profiles/minecraft/${name}`).json<IMojangName>();

	if (typeof res === 'string') {
		return null;
	}

	return res;
};
