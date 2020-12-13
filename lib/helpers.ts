import {NextPageContext} from 'next';

const getBaseURL = (ctx: NextPageContext) => {
	const protocol = process.env.PROTOCOL === 'https' ? 'https' : 'http';
	const host = process.browser ? window.location.host : ctx.req?.headers.host ?? '';

	return `${protocol}://${host}`;
};

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export {getBaseURL, getRandomInt};
