import {NextApiResponse} from 'next';
import nc from 'next-connect';
import {Prisma} from '@prisma/client';
import {authMiddleware, IRequestWithUser} from '../../lib/auth';
import {parseId} from '../../lib/parse-params';
import prisma from '../../lib/db';

export default nc()
	.use(authMiddleware({limitToOfficer: false}))
	.get(async (request: IRequestWithUser, res: NextApiResponse) => {
		const id = parseId(request);

		if (request.user.id !== id && !request.user.isOfficer) {
			res.status(401).json({error: 'Unauthorized'});
			return;
		}

		try {
			const where: Prisma.UserConnectionHistoryFindManyArgs['where'] = {
				userId: id
			};

			if (request.query.after) {
				where.createdAt = {
					gt: new Date(request.query.after as string)
				};
			}

			if (request.query.before) {
				where.createdAt = {
					lt: new Date(request.query.before as string)
				};
			}

			res.json({
				data: await prisma.userConnectionHistory.findMany({where, orderBy: {createdAt: request.query.order as Prisma.SortOrder ?? 'asc'}})
			});
		} catch {
			res.status(500).json({error: 'Unknown server error'});
		}
	});
