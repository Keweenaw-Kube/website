import React from 'react';
import {Title, Container, Box, Block, Table, Button, Icon, Progress} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import {privateRoute} from '../../components/private-route';
import {useAPIRoute} from '../../components/api-client-context';

interface IServer {
	id: number;
	name: string;
	domain: string;
	description: string;
	createdAt: string;
}

const ServersPage = () => {
	const servers = useAPIRoute<IServer[]>('/api/servers');

	return (
		<Container>
			<Block/>

			<Title size={1}>Servers</Title>

			{
				servers ? (
					<Table fullwidth>
						<Table.Head>
							<Table.Row>
								<Table.Heading>Name</Table.Heading>
								<Table.Heading>Domain</Table.Heading>
								<Table.Heading>Edit</Table.Heading>
							</Table.Row>
						</Table.Head>

						{/* @ts-expect-error */}
						<Table.Body>
							{
								/* @ts-expect-error */
								servers.map(server => (
									<Table.Row key={server.id}>
										<Table.Cell>{server.name}</Table.Cell>
										<Table.Cell>{server.domain}</Table.Cell>
										<Table.Cell>
											<Button color="warning">
												<Icon size="small">
													<FontAwesomeIcon icon={faPen} color="black"/>
												</Icon>
											</Button>
										</Table.Cell>
									</Table.Row>
								))
							}
						</Table.Body>
					</Table>
				) : (
					<Progress color="primary"/>
				)
			}
		</Container>
	);
};

export default privateRoute(ServersPage);
