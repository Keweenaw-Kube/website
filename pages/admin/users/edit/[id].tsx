import React, {useState, useEffect, useMemo} from 'react';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import {Title, Container, Block} from 'rbx';
import {IUser, IUserWithSponsorInfo} from '../../../../lib/types';
import Breadcrumbs from '../../../../components/breadcrumbs';
import {privateRoute} from '../../../../components/private-route';
import {useAPI} from '../../../../components/api-client-context';
import ModelEdit, {IFieldDefinition} from '../../../../components/model-edit';
import {APIClient} from '../../../../lib/api-client';

const EditUser: NextPage<{user: IUserWithSponsorInfo}> = ({user: propsUser}) => {
	const router = useRouter();
	const [user, setUser] = useState(propsUser);
	const [sponsoredByUser, setSponsoredByUser] = useState<IUser | null>(user.sponsoredBy ?? null);
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const {client} = useAPI();

	const handleSubmit = async (event?: React.FormEvent) => {
		if (event) {
			event.preventDefault();
		}

		setLoading(true);
		try {
			const {sponsoredBy, sponsoring, ...userWithoutDeepSponsor} = user;

			await client.putUser(user.id, {
				...userWithoutDeepSponsor,
				sponsoredByUserId: sponsoredByUser?.id ?? null,
				email: sponsoredByUser ? null : user.email
			});

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
					getSuggestionValue: (s: IUser) => s.email ?? '',
					searchFields: ['email', 'minecraftUsername'],
					onSelection: setSponsoredByUser,
					onClear: () => setSponsoredByUser(null),
					// User can't sponsor themselves
					filter: (u: IUser) => u.id !== user.id
				}
			}
		];

		if (!sponsoredByUser) {
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

		if (user.isBanned) {
			f.push({
				label: 'Ban Message',
				name: 'banMessage',
				value: user.banMessage ?? '',
				type: 'input'
			});
		}

		return f;
	}, [user, sponsoredByUser]);

	return (
		<Container>
			<Block/>

			<Breadcrumbs/>

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

export default privateRoute<{user: IUserWithSponsorInfo}>(EditUser);
