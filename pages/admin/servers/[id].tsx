import React, {useState} from 'react';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import {Title, Container, Box, Block, Field, Label, Control, Input, Textarea, Button} from 'rbx';
import {IServer} from '../../../lib/types';
import {privateRoute} from '../../../components/private-route';
import {useAPI} from '../../../components/api-client-context';
import ModelEdit from '../../../components/model-edit';
import {APIClient} from '../../../lib/api-client';

const EditServer: NextPage<{server: IServer}> = ({server: propsServer}) => {
	const [server, setServer] = useState(propsServer);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const {client} = useAPI();

	const handleSubmit = async (event?: React.FormEvent) => {
		if (event) {
			event.preventDefault();
		}

		setLoading(true);
		await client.putServer(server.id, server);
		setLoading(false);
		router.back();
	};

	const handleFieldChange = (name: string, value: string) => setServer(s => ({...s, [name]: value}));

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

	return (
		<Container>
			<Block/>

			<Title size={1}>Edit</Title>

			<form onSubmit={handleSubmit}>
				<ModelEdit fields={fields} loading={loading} backHref="/admin/servers" onChange={handleFieldChange}/>
			</form>
		</Container>
	);
};

EditServer.getInitialProps = async context => {
	const id = Number.parseInt((context.query.id as string), 10);

	const client = new APIClient(context);

	const server = await client.getServer(id);

	return {server};
};

export default privateRoute<{server: IServer}>(EditServer);
