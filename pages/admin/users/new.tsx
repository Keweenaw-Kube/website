import React, {useEffect, useState, useMemo} from 'react';
import {useRouter} from 'next/router';
import {Container, Block, Title} from 'rbx';
import {Except} from 'type-fest';
import Breadcrumbs from '../../../components/breadcrumbs';
import {useAPI} from '../../../components/api-client-context';
import {privateRoute} from '../../../components/private-route';
import ModelEdit, {IFieldDefinition} from '../../../components/model-edit';
import {IUser} from '../../../lib/types';

const NewUser = () => {
	const {client} = useAPI();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [user, setUser] = useState<Except<IUser, 'id' | 'minecraftUUID' | 'lastLoggedInAt'>>({
		email: '',
		minecraftUsername: '',
		isOfficer: false,
		isMember: false,
		isBanned: false
	});
	const [sponsoredByUser, setSponsoredByUser] = useState<IUser | null>(null);

	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		setLoading(true);

		try {
			await client.createUser({
				...user,
				sponsoredByUserId: sponsoredByUser?.id ?? null
			});

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

	const fields = useMemo(() => {
		let f: IFieldDefinition[] = [
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
			},
			{
				label: 'Sponsored By',
				name: 'sponsoredByUserId',
				type: 'object-select',
				value: sponsoredByUser,
				objectSelect: {
					apiPath: '/api/users?has=email',
					placeholder: 'Email or username',
					renderSuggestion: (s: IUser) => (
						<>
							<span style={{marginRight: '1rem'}}>{s.email}</span>
							<span>{s.minecraftUsername}</span>
						</>
					),
					getSuggestionValue: (s: IUser) => s.email ?? s.minecraftUsername,
					searchFields: ['email', 'minecraftUsername'],
					onSelection: setSponsoredByUser,
					onClear: () => setSponsoredByUser(null)
				}
			}
		];

		if (!user.sponsoredByUserId && !sponsoredByUser) {
			f = [
				{
					label: 'Email',
					name: 'email',
					value: user.email ?? '',
					type: 'email',
					required: true
				},
				...f
			];
		}

		return f;
	}, [user, sponsoredByUser]);

	return (
		<Container>
			<Block/>

			<Breadcrumbs/>

			<Title size={1}>Add a user</Title>

			<form onSubmit={handleFormSubmit}>
				<ModelEdit fields={fields} loading={loading} backHref="/admin/users" errorMsg={errorMsg} onChange={handleFieldChange}/>
			</form>
		</Container>
	);
};

export default privateRoute(NewUser);
