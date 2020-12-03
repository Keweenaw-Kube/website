import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Container, Block, Title, Field, Label, Control, Input, Button, Message, Checkbox} from 'rbx';
import {Except} from 'type-fest';
import {useAPI} from '../../../components/api-client-context';
import {privateRoute} from '../../../components/private-route';
import ModelEdit, {IFieldDefinition} from '../../../components/model-edit';
import {IUser} from '../../../lib/types';

const NewUser = () => {
	const {client} = useAPI();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [user, setUser] = useState<Except<Except<IUser, 'id'>, 'minecraftUUID'>>({
		email: '',
		minecraftUsername: '',
		isOfficer: false,
		isMember: false,
		isBanned: false
	});

	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		setLoading(true);

		try {
			await client.createUser(user);

			setErrorMsg('');

			await router.push('/admin/users');
		} catch (error: unknown) {
			setErrorMsg((error as Error).message);
		} finally {
			setLoading(false);
		}
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

			<Title size={1}>Add a user</Title>

			<form onSubmit={handleFormSubmit}>
				<ModelEdit fields={fields} loading={loading} backHref="/admin/users" errorMsg={errorMsg} onChange={handleFieldChange}/>
			</form>
		</Container>
	);
};

export default privateRoute(NewUser);
