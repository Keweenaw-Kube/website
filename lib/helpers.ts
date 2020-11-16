import {NextPageContext} from 'next';

const getBaseURL = (ctx: NextPageContext) => {
	const protocol = process.env.PROTOCOL === 'https' ? 'https' : 'http';
	const host = process.browser ? window.location.host : ctx.req?.headers.host ?? '';

	return `${protocol}://${host}`;
};

export {getBaseURL};
