import React, {useState, useMemo} from 'react';
import {useRouter} from 'next/router';
import {Container, Block, Title, File, Field, Input, Label, Control} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUpload} from '@fortawesome/free-solid-svg-icons';
import FormActions from '../../../components/form-actions';
import FormError from '../../../components/form-error';
import {useAPI} from '../../../components/api-client-context';
import Breadcrumbs from '../../../components/breadcrumbs';
import {privateRoute} from '../../../components/private-route';
import ObjectAutosuggestSelector from '../../../components/object-autosuggest-selector';
import {IUser, IServer} from '../../../lib/types';

const AddPicture = () => {
	const {client} = useAPI();
	const router = useRouter();
	const [file, setFile] = useState<File>();
	const [user, setUser] = useState<IUser>();
	const [server, setServer] = useState<IServer>();
	const [caption, setCaption] = useState('');
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
		if (!file) {
			setErrorMsg('No file was provided.');
			return;
		}

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
			const {path, height, width} = await client.uploadPicture(file);
			await client.createPicture({
				userId: user.id,
				serverId: server.id,
				path,
				height,
				width,
				isApproved: true,
				caption
			});

			setErrorMsg('');

			await router.push('/admin/pictures');
		} catch (error: unknown) {
			setErrorMsg((error as Error).message);
		}

		setLoading(false);
	};

	return (
		<Container>
			<Block/>

			<Breadcrumbs/>

			<Title size={1}>Add a picture</Title>

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

				{previewURL && (
					<Field>
						<div style={{height: '30vh', width: '30vh'}}>
							{previewURL && <img src={previewURL} style={{maxHeight: '100%', maxWidth: '100%'}}/>}
						</div>
					</Field>
				)}

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

				<FormActions loading={loading} onCancel={async () => router.push('/admin/pictures')}/>
			</form>
		</Container>
	);
};

export default privateRoute(AddPicture);
