import React, {useState, useMemo} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {Container, Block, Title, File, Field, Input, Label, Control} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUpload} from '@fortawesome/free-solid-svg-icons';
import FormActions from '../../../components/form-actions';
import FormError from '../../../components/form-error';
import {useAPI} from '../../../components/api-client-context';
import {privateRoute} from '../../../components/private-route';
import ObjectAutosuggestSelector from '../../../components/object-autosuggest-selector';
import {IUser, IServer, IPicture} from '../../../lib/types';
import {APIClient, IPictureWithRelations} from '../../../lib/api-client';
import {NextPage} from 'next';

const EditPicture: NextPage<{picture: IPictureWithRelations}> = ({picture: propsPicture}) => {
	const {client} = useAPI();
	const router = useRouter();
	const [file, setFile] = useState<File>();
	const [user, setUser] = useState<IUser>(propsPicture.user);
	const [server, setServer] = useState<IServer>(propsPicture.server);
	const [caption, setCaption] = useState(propsPicture.caption);
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.currentTarget.files && event.currentTarget.files.length > 0) {
			setFile(event.currentTarget.files[0]);
		}
	};

	const previewURL = useMemo(() => file ? URL.createObjectURL(file) : null, [file]);

	const handleSave = async (event: React.FormEvent) => {
		event.preventDefault();

		// Validate
		if (!user) {
			setErrorMsg('User was not selected.');
			return;
		}

		if (!server) {
			setErrorMsg('Server was not selected.');
			return;
		}

		setLoading(true);
		try {
			let {path, height, width} = propsPicture;

			if (file) {
				({path, height, width} = await client.uploadPicture(file));
			}

			await client.putPicture(propsPicture.id, {
				id: propsPicture.id,
				userId: user.id,
				serverId: server.id,
				path,
				height,
				width,
				isApproved: propsPicture.isApproved,
				caption
			});

			setErrorMsg('');

			await router.push('/admin/pictures');
		} catch (error: unknown) {
			setErrorMsg((error as Error).message);
		}

		setLoading(false);
	};

	const handleDelete = async () => {
		setLoading(true);
		await client.deletePicture(propsPicture.id);
		setLoading(false);

		await router.replace('/admin/pictures');
	};

	return (
		<Container>
			<Block/>

			<Title size={1}>Edit picture</Title>

			<FormError error={errorMsg}/>

			<form onSubmit={handleSave}>
				<Field>
					<File hasName>
						<File.Label>
							<File.Input accept="image/*" onChange={handleFileSelect}/>
							{/* eslint-disable-next-line react/jsx-pascal-case */}
							<File.CTA>
								<File.Icon>
									<FontAwesomeIcon icon={faUpload}/>
								</File.Icon>
								<File.Label as="span">Choose an image</File.Label>
							</File.CTA>

							{file?.name && <File.Name>{file?.name}</File.Name>}
						</File.Label>
					</File>
				</Field>

				<Field>
					<div style={{height: '30vh', width: '30vh', position: 'relative'}}>
						{!previewURL && <Image src={propsPicture.path} layout="fill" objectFit="contain"/>}
						{previewURL && <img src={previewURL} style={{maxHeight: '100%', maxWidth: '100%'}}/>}
					</div>
				</Field>

				<ObjectAutosuggestSelector
					label="User:"
					placeholder="Email or username"
					apiPath="/api/users"
					renderSuggestion={(s: IUser) => (
						<>
							<span style={{marginRight: '1rem'}}>{s.email}</span>
							<span>{s.minecraftUsername}</span>
						</>
					)}
					getSuggestionValue={s => s.email}
					selection={user}
					searchFields={['email', 'minecraftUsername']}
					onSelection={setUser}
				/>

				<ObjectAutosuggestSelector
					label="Server:"
					placeholder="Server name or domain"
					apiPath="/api/servers"
					renderSuggestion={(s: IServer) => (
						<span>{s.name}</span>
					)}
					getSuggestionValue={s => s.name}
					selection={server}
					searchFields={['name', 'domain']}
					onSelection={setServer}
				/>

				<Field>
					<Label>Caption:</Label>
					<Control>
						<Input placeholder="Hey that's pretty neat" value={caption} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCaption(e.target.value)}/>
					</Control>
				</Field>

				<FormActions loading={loading} onCancel={async () => router.push('/admin/pictures')} onDelete={handleDelete}/>
			</form>
		</Container>
	);
};

EditPicture.getInitialProps = async context => {
	const id = Number.parseInt((context.query.id as string), 10);

	const client = new APIClient(context);

	const picture = await client.getPicture(id);

	// TODO: handle 404s properly

	return {picture};
};

export default privateRoute<{picture: IPictureWithRelations}>(EditPicture);
