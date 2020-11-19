import React, {useState} from 'react';
import {Container, Block, Title} from 'rbx';
import {useRouter} from 'next/router';
import {IRole} from '../../../lib/types';
import ModelEdit from '../../../components/model-edit';
import {useAPI} from '../../../components/api-client-context';

const NewRole = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [role, setRole] = useState<IRole>({id: -1, name: ''});
	const {client} = useAPI();

	const fields = [
		{
			label: 'Name',
			name: 'name',
			value: role.name
		}
	];

	const handleSubmit = async () => {
		setLoading(true);
		const s = {...role};
		delete (s as any).id;
		await client.createRole(s);
		setLoading(false);
		await router.push('/admin/roles');
	};

	const handleFieldChange = (name: string, value: string) => setRole(s => ({...s, [name]: value}));

	return (
		<Container>
			<Block/>

			<Title size={1}>Add a role</Title>

			<ModelEdit fields={fields} loading={loading} onSave={handleSubmit} onChange={handleFieldChange}/>
		</Container>
	);
};

export default NewRole;
