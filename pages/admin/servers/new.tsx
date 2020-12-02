import React, {useState} from 'react';
import {Container, Block, Title} from 'rbx';
import {useRouter} from 'next/router';
import {IServer} from '../../../lib/types';
import ModelEdit from '../../../components/model-edit';
import {useAPI} from '../../../components/api-client-context';

const NewServer = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [server, setServer] = useState<IServer>({id: -1, name: '', domain: '', description: ''});
	const {client} = useAPI();

	const fields = [
		{
			label: 'Name',
			name: 'name',
			value: server.name
		},
		{
			label: 'Domain',
			name: 'domain',
			value: server.domain
		},
		{
			label: 'Description',
			name: 'description',
			value: server.description,
			type: 'textarea' as const
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

	const handleFieldChange = (name: string, value: string) => setServer(s => ({...s, [name]: value}));

	return (
		<Container>
			<Block/>

			<Title size={1}>Add a server</Title>

			<form onSubmit={handleSubmit}>
				<ModelEdit fields={fields} loading={loading} onChange={handleFieldChange}/>
			</form>
		</Container>
	);
};

export default NewServer;
