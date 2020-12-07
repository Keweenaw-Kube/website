import {NextApiRequest} from 'next';

export const parseId = (request: NextApiRequest) => Number.parseInt(request.query.id as string, 10);
