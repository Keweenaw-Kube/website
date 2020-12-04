import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import Busboy from 'busboy';
import {nanoid} from 'nanoid';
import {v2 as cloudinary} from 'cloudinary';
import {authMiddleware} from '../lib/auth';
import {CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} from '../lib/config';

cloudinary.config({
	cloud_name: CLOUDINARY_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
});

export default nc()
	.use(authMiddleware({limitToOfficer: true}))
	.post(async (request: NextApiRequest, res: NextApiResponse) => {
		const busboy = new Busboy({headers: request.headers});

		busboy.on('file', (_, file) => {
			// Cloudinary automatically adds the correct extension
			const path = nanoid();

			const uploadStream = cloudinary.uploader.upload_stream({public_id: path}, (error, result) => {
				if (error) {
					res.status(500).json({error: 'Error uploading file'});
					return;
				}

				res.json({data: {path, width: result!.width, height: result!.height}});
			});

			file.pipe(uploadStream);
		}).on('error', () => {
			res.status(500).json({error: 'Error parsing file'});
		});

		return request.pipe(busboy);
	});

export const config = {
	api: {
		bodyParser: false
	}
};
