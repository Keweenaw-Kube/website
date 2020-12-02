import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Container, Block, Title, Field, Label, Control, Input, Button, Message, Checkbox} from 'rbx';
import {useAPI} from '../../../components/api-client-context';
import {privateRoute} from '../../../components/private-route';
import FormActions from '../../../components/form-actions';

const NewUser = () => {
	const {client} = useAPI();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [username, setUsername] = useState('');
	const [uuid, setUUID] = useState('');
	const [email, setEmail] = useState('');
	const [isMember, setIsMember] = useState(false);
	const [isOfficer, setIsOfficer] = useState(false);

	const handleUsernameCheck = async () => {
		if (username === '') {
			setErrorMsg('Username was not provided.');
			return;
		}

		setLoading(true);

		const profiles = await client.getMojangProfile(username);

		if (profiles.length > 0) {
			setUUID(profiles[0].id);
			setErrorMsg('');
		} else {
			setErrorMsg('User was not found.');
		}

		setLoading(false);
	};

	const handleSave = async () => {
		setLoading(true);

		try {
			await client.createUser({
				email,
				minecraftUUID: uuid,
				minecraftUsername: username,
				isOfficer,
				isMember,
				isBanned: false
			});

			setErrorMsg('');

			await router.push('/admin/users');
		} catch (error: unknown) {
			setErrorMsg((error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		await (uuid === '' ? handleUsernameCheck() : handleSave());
	};

	useEffect(() => {
		if (isOfficer) {
			setIsMember(true);
		}
	}, [isOfficer]);

	return (
		<Container>
			<Block/>

			<Title size={1}>Add a user</Title>

			{
				errorMsg !== '' && (
					<Message color="danger">
						<Message.Body>
							{errorMsg}
						</Message.Body>
					</Message>
				)
			}

			<form onSubmit={handleFormSubmit}>
				<Field>
					<Label>Minecraft username:</Label>
					<Control>
						<Input type="text" value={username} disabled={uuid !== ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}/>
					</Control>
				</Field>

				{
					uuid === '' ? (
						<Button color="primary" state={loading ? 'loading' : undefined}>Check username</Button>
					) : (
						<>
							<Field>
								<Label>Email:</Label>
								<Control>
									<Input required type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
								</Control>
							</Field>

							<Field>
								<Label>Is member:</Label>
								<Control>
									<Checkbox checked={isMember || isOfficer} disabled={isOfficer} onChange={() => setIsMember(s => !s)}/>
								</Control>
							</Field>

							<Field>
								<Label>Is officer:</Label>
								<Control>
									<Checkbox checked={isOfficer} onChange={() => setIsOfficer(s => !s)}/>
								</Control>
							</Field>

							<FormActions loading={loading} onCancel={() => router.back()}/>
						</>
					)
				}
			</form>
		</Container>
	);
};

export default privateRoute(NewUser);
