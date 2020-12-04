import React, {useState, useMemo} from 'react';
import {useRouter} from 'next/router';
import {Container, Block, Title, File} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUpload} from '@fortawesome/free-solid-svg-icons';
import FormActions from '../../../components/form-actions';
import FormError from '../../../components/form-error';
import {useAPI} from '../../../components/api-client-context';

const AddPicture = () => {
	const {client} = useAPI();
	const router = useRouter();
	const [file, setFile] = useState<File>();
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

		if (!file) {
			return;
		}

		setLoading(true);
		try {
			const {path, height, width} = await client.uploadPicture(file);
			await client.createPicture({
				// TODO: update to correct dynamic values
				userId: 49,
				serverId: 13,
				path,
				height,
				width,
				isApproved: true
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

			<Title size={1}>Add a picture</Title>

			<FormError error={errorMsg}/>

			<form onSubmit={handleSave}>
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

				{previewURL && (
					<>
						<Block/>

						<div style={{height: '30vh', width: '30vh'}}>
							{previewURL && <img src={previewURL} style={{maxHeight: '100%', maxWidth: '100%'}}/>}
						</div>

						<Block/>

						<FormActions loading={loading} onCancel={async () => router.push('/admin/pictures')}/>
					</>
				)}

			</form>
		</Container>
	);
};

export default AddPicture;
