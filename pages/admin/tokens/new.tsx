import React, {useState} from 'react';
import {Container, Block, Title} from 'rbx';
import {useRouter} from 'next/router';
import {IToken} from '../../../lib/types';
import Breadcrumbs from '../../../components/breadcrumbs';
import ModelEdit, {IFieldDefinition} from '../../../components/model-edit';
import {useAPI} from '../../../components/api-client-context';

const NewToken = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState('');
	const {client} = useAPI();

	const fields: IFieldDefinition[] = [
		{
			label: 'Name',
			name: 'name',
			value: name,
			type: 'input'
		}
	];

	const handleSubmit = async (event?: React.FormEvent) => {
		if (event) {
			event.preventDefault();
		}

		setLoading(true);
		await client.createToken(name);
		setLoading(false);
		await router.push('/admin/tokens');
	};

	const handleFieldChange = (name: string, value: string | boolean) => setName(value as string);

	return (
		<Container>
			<Block/>

			<Breadcrumbs/>

			<Title size={1}>Add a token</Title>

			<form onSubmit={handleSubmit}>
				<ModelEdit fields={fields} loading={loading} onChange={handleFieldChange} onCancel={async () => router.push('/admin/tokens')}/>
			</form>
		</Container>
	);
};

export default NewToken;
