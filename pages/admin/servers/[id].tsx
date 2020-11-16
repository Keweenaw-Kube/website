import React, {useState} from 'react';
import {NextPage} from 'next';
import {Title, Container, Box, Block, Field, Label, Control, Input, Textarea, Button} from 'rbx';
import {IServer} from '../../../lib/types';
import {privateRoute} from '../../../components/private-route';
import {useAPI} from '../../../components/api-client-context';
import {APIClient} from '../../../lib/api-client';

const WrappedField = ({label, value, onChange, as}: {label: string; value: string; onChange: (v: string) => void; as?: string}) => (
	<Field>
		<Label>{label}</Label>
		<Control>
			{
				as === 'textarea' ? (
					<Textarea value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}/>
				) : (
					<Input type="text" value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}/>
				)
			}
		</Control>
	</Field>
);

const EditServer: NextPage<{server: IServer}> = ({server}) => {
	const [name, setName] = useState(server.name);
	const [description, setDescription] = useState(server.description);
	const [domain, setDomain] = useState(server.domain);

	const {client} = useAPI();

	const handleSubmit = async () => {
		await client.putServer(server.id, {
			name,
			description,
			domain
		});
	};

	return (
		<Container>
			<Block/>

			<Title size={1}>Edit {name}</Title>

			<WrappedField label="Name" value={name} onChange={setName}/>
			<WrappedField label="Domain" value={domain} onChange={setDomain}/>
			<WrappedField label="Description" value={description} as="textarea" onChange={setDescription}/>

			<Field>
				<Control>
					<Button color="primary" onClick={handleSubmit}>Save</Button>
				</Control>
			</Field>
		</Container>
	);
};

EditServer.getInitialProps = async context => {
	const id = Number.parseInt((context.query.id as string), 10);

	const client = new APIClient(context);

	const server = await client.getServer(id);

	return {server};
};

export default privateRoute(EditServer);
