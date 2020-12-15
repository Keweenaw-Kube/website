import {NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware, IRequestWithUser} from '../lib/auth';

export default nc()
	.use(authMiddleware({limitToOfficer: true}))
	.delete(async (request: IRequestWithUser, res: NextApiResponse) => {
		const token = request.query.token as string;

		await prisma.authToken.delete({
			where: {
				token
			}
		});

		res.json({});
	});
