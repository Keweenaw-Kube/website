import React from 'react';
import {Container, Block, Title, Button, Column, Message} from 'rbx';
import Link from 'next/link';
import {useAPI} from '../components/api-client-context';
import {privateRoute} from '../components/private-route';

const Dashboard = () => {
	const {client} = useAPI();

	return (
		<Container>
			<Block/>

			<Title size={1}>Hello, {client.token.decodedToken.name}.</Title>

			<Message color="warning">
				<Message.Body>
					You need to link your Minecraft account before you can join servers.
				</Message.Body>
			</Message>

			<Block/>

			<Column.Group multiline>
				<Column size="full">
					<Link passHref href="/link/minecraft">
						<Button color="info" as="a">Link Minecraft account</Button>
					</Link>
				</Column>
			</Column.Group>
			<Block/>
		</Container>
	);
};

export default privateRoute(Dashboard);
