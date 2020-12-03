import got from 'got';
import {IMojangName, IMojangUser} from '../../../lib/types';

export const getProfileByUUID = async (uuid: string) => {
	return got.get(`https://api.mojang.com/user/profiles/${uuid}/names`).json<IMojangName[]>();
};

export const getProfileByName = async (name: string) => {
	return got.post('https://api.mojang.com/profiles/minecraft', {json: [name]}).json<IMojangUser[]>();
};
