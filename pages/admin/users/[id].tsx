import React, {useState, useEffect} from 'react';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import {Title, Container, Box, Block, Field, Label, Control, Input, Textarea, Button} from 'rbx';
import {IUser} from '../../../lib/types';
import {privateRoute} from '../../../components/private-route';
import {useAPI} from '../../../components/api-client-context';
import ModelEdit, {IFieldDefinition} from '../../../components/model-edit';
import {APIClient} from '../../../lib/api-client';

const EditUser: NextPage<{user: IUser}> = ({user: propsUser}) => {
	const router = useRouter();
	const [user, setUser] = useState(propsUser);
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const {client} = useAPI();

	const handleSubmit = async (event?: React.FormEvent) => {
		if (event) {
			event.preventDefault();
		}

		setLoading(true);
		try {
			await client.putUser(user.id, user);

			setErrorMsg('');

			await router.push('/admin/users');
		} catch (error: unknown) {
			setErrorMsg((error as Error).message);
		}

		setLoading(false);
	};

	const handleDelete = async () => {
		setLoading(true);
		await client.deleteUser(user.id);
		setLoading(false);

		await router.replace('/admin/users');
	};

	useEffect(() => {
		if (user.isOfficer) {
			setUser(u => ({...u, isMember: true}));
		}
	}, [user.isOfficer]);

	const handleFieldChange = (name: string, value: string | boolean) => setUser(s => ({...s, [name]: value}));

	const fields: IFieldDefinition[] = [
		{
			label: 'Email',
			name: 'email',
			value: user.email,
			type: 'email',
			required: true
		},
		{
			label: 'Minecraft Username',
			name: 'minecraftUsername',
			value: user.minecraftUsername,
			type: 'input'
		},
		{
			label: 'Is Officer',
			name: 'isOfficer',
			value: user.isOfficer,
			type: 'checkbox'
		},
		{
			label: 'Is Member',
			name: 'isMember',
			value: user.isMember,
			type: 'checkbox',
			disabled: user.isOfficer
		},
		{
			label: 'Is Banned',
			name: 'isBanned',
			value: user.isBanned,
			type: 'checkbox'
		}
	];

	return (
		<Container>
			<Block/>

			<Title size={1}>Edit</Title>

			<form onSubmit={handleSubmit}>
				<ModelEdit fields={fields} loading={loading} backHref="/admin/users" errorMsg={errorMsg} onChange={handleFieldChange} onDelete={handleDelete}/>
			</form>
		</Container>
	);
};

EditUser.getInitialProps = async context => {
	const id = Number.parseInt((context.query.id as string), 10);

	const client = new APIClient(context);

	const user = await client.getUser(id);

	// TODO: handle 404s properly

	return {user};
};

export default privateRoute<{user: IUser}>(EditUser);
