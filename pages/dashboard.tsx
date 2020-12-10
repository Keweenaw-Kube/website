import React, {useEffect, useState} from 'react';
import {Container, Block, Title, Button, Column, Message, Icon} from 'rbx';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLink} from '@fortawesome/free-solid-svg-icons';
import {IUser} from '../lib/types';
import {useAPI, useAPIRoute} from '../components/api-client-context';
import {privateRoute} from '../components/private-route';

const Dashboard = () => {
	const router = useRouter();
	const {client} = useAPI();
	const user = useAPIRoute<IUser>(`/api/users/${client.token.decodedToken.id}`);
	const [loading, setLoading] = useState(false);

	const isMinecraftLinked = user && (user.minecraftUUID && user.minecraftUUID !== '');

	const handleMinecraftLink = async () => {
		setLoading(true);
		if (isMinecraftLinked) {
			await client.unlinkMinecraftAccount();
		}

		setLoading(false);

		await router.push('/link/minecraft');
	};

	return (
		<Container>
			<Block/>

			<Title size={1}>Hello, {client.token.decodedToken.name}.</Title>

			{
				(user && !isMinecraftLinked) && (
					<Message color="warning">
						<Message.Body>
							You need to link your Minecraft account before you can join servers.
						</Message.Body>
					</Message>
				)
			}

			{
				isMinecraftLinked && (
					<Message color="success">
						<Message.Body>
							You&apos;re ready to play! Go check out the <Link passHref href="/servers"><a className="is-link">servers</a></Link> to get started.
						</Message.Body>
					</Message>
				)
			}

			<Block/>

			<Column.Group multiline>
				<Column size="full">
					<Button color={isMinecraftLinked ? 'danger' : 'info'} state={loading ? 'loading' : undefined} onClick={handleMinecraftLink}>
						<Icon size="small">
							<FontAwesomeIcon icon={faLink}/>
						</Icon>

						<span>{isMinecraftLinked ? 'Relink Minecraft account' : 'Link Minecraft account'}</span>
					</Button>
				</Column>
			</Column.Group>
			<Block/>
		</Container>
	);
};

export default privateRoute(Dashboard);
