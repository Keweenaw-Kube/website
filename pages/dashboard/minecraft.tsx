import React, {useState, useCallback} from 'react';
import {useRouter} from 'next/router';
import {Container, Block, Title, Button, Column, Input} from 'rbx';
import {IServer} from '../../lib/types';
import {useAPI, useAPIRoute} from '../../components/api-client-context';
import {privateRoute} from '../../components/private-route';
import ServerDomainTag from '../../components/server-domain-tag';
import FormError from '../../components/form-error';
import Breadcrumbs from '../../components/breadcrumbs';

const LinkMinecraft = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [code, setCode] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const {client} = useAPI();
	const servers = useAPIRoute<IServer[]>('/api/servers?isArchived=false');

	const handleLinkRequest = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();

		if (code === '') {
			setErrorMsg('Please enter a code.');
			return;
		}

		setLoading(true);
		try {
			await client.linkMinecraftAccount(code);

			setErrorMsg('');

			await router.push('/dashboard');
		} catch (error: unknown) {
			setErrorMsg((error as Error).message);
		}

		setLoading(false);
	}, [code, client, router]);

	return (
		<Container>
			<Block/>

			<Breadcrumbs/>

			<Title size={1}>Link Minecraft account</Title>

			<FormError error={errorMsg}/>

			<Column.Group vcentered gapSize={1}>
				<Column narrow>First, attempt to join any server, like</Column>

				<Column narrow>
					{
						servers && servers.length > 0 && (
							<ServerDomainTag {...servers[0]} hasText={false}/>
						)
					}
				</Column>
			</Column.Group>

			<Block/>

			<form onSubmit={handleLinkRequest}>
				<Column.Group vcentered gapSize={1}>
					<Column narrow>You&apos;ll be kicked and a 6 digit code will be displayed. Enter it here:</Column>

					<Column narrow>
						<Input type="number" style={{width: '12ch'}} value={code} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}/>
					</Column>

					<Column narrow>
						<Button color="primary" state={loading ? 'loading' : undefined}>Link</Button>
					</Column>
				</Column.Group>
			</form>
		</Container>
	);
};

export default privateRoute(LinkMinecraft);
