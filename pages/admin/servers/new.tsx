import React, {useState} from 'react';
import {Container, Block, Title} from 'rbx';
import {useRouter} from 'next/router';
import {IServer} from '../../../lib/types';
import Breadcrumbs from '../../../components/breadcrumbs';
import ModelEdit, {IFieldDefinition} from '../../../components/model-edit';
import {useAPI} from '../../../components/api-client-context';

const NewServer = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [server, setServer] = useState<IServer>({
		id: -1,
		name: '',
		domain: '',
		description: '',
		limitToMembers: false,
		isArchived: false,
		archiveFileUrl: null
	});
	const {client} = useAPI();

	const fields: IFieldDefinition[] = [
		{
			label: 'Name',
			name: 'name',
			value: server.name,
			type: 'input'
		},
		{
			label: 'Domain',
			name: 'domain',
			value: server.domain,
			type: 'input'
		},
		{
			label: 'Description',
			name: 'description',
			value: server.description,
			type: 'textarea'
		},
		{
			label: 'Limit to members',
			name: 'limitToMembers',
			value: server.limitToMembers,
			type: 'checkbox'
		}
	];

	const handleSubmit = async (event?: React.FormEvent) => {
		if (event) {
			event.preventDefault();
		}

		setLoading(true);
		const s = {...server};
		delete (s as any).id;
		await client.createServer(s);
		setLoading(false);
		await router.push('/admin/servers');
	};

	const handleFieldChange = (name: string, value: string | boolean) => setServer(s => ({...s, [name]: value}));

	return (
		<Container>
			<Block/>

			<Breadcrumbs/>

			<Title size={1}>Add a server</Title>

			<form onSubmit={handleSubmit}>
				<ModelEdit fields={fields} loading={loading} onChange={handleFieldChange} onCancel={async () => router.push('/admin/servers')}/>
			</form>
		</Container>
	);
};

export default NewServer;
