import {NextApiResponse} from 'next';
import nc from 'next-connect';
import {authMiddleware, IRequestWithUser} from '../../lib/auth';
import getUserSessions from '../../lib/get-user-sessions';
import {parseId} from '../../lib/parse-params';

export default nc()
	.use(authMiddleware({limitToOfficer: false}))
	.get(async (request: IRequestWithUser, res: NextApiResponse) => {
		const id = parseId(request);

		if (request.user.id !== id && !request.user.isOfficer) {
			res.status(401).json({error: 'Unauthorized'});
			return;
		}

		try {
			res.json({
				data: await getUserSessions({
					userId: id,
					after: request.query.after ? new Date(request.query.after as string) : undefined,
					before: request.query.before ? new Date(request.query.before as string) : undefined
				})
			});
		} catch {
			res.status(500).json({error: 'Unknown server error'});
		}
	});
