import React, {useState} from 'react';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import {Title, Container, Box, Block, Field, Label, Control, Input, Textarea, Button} from 'rbx';
import {IRole} from '../../../lib/types';
import {privateRoute} from '../../../components/private-route';
import {useAPI} from '../../../components/api-client-context';
import ModelEdit from '../../../components/model-edit';
import {APIClient} from '../../../lib/api-client';

const EditRole: NextPage<{role: IRole}> = ({role: propsRole}) => {
	const [role, setRole] = useState(propsRole);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const {client} = useAPI();

	const handleSubmit = async () => {
		setLoading(true);
		await client.putRole(role.id, role);
		setLoading(false);
		router.back();
	};

	const handleFieldChange = (name: string, value: string) => setRole(s => ({...s, [name]: value}));

	const fields = [
		{
			label: 'Name',
			name: 'name',
			value: role.name
		}
	];

	return (
		<Container>
			<Block/>

			<Title size={1}>Edit</Title>

			<ModelEdit fields={fields} loading={loading} onSave={handleSubmit} onChange={handleFieldChange}/>
		</Container>
	);
};

EditRole.getInitialProps = async context => {
	const id = Number.parseInt((context.query.id as string), 10);

	const client = new APIClient(context);

	const role = await client.getRole(id);

	return {role};
};

export default privateRoute<{role: IRole}>(EditRole);
