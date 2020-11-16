import React from 'react';
import Link from 'next/link';
import {Title, Container, Box, Block, Table, Button, Icon, Progress, Column} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import {privateRoute} from '../../../components/private-route';
import {useAPIRoute} from '../../../components/api-client-context';

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

			<Column.Group vcentered>
				<Column>
					<Title size={1}>Servers</Title>
				</Column>

				<Column narrow pull="right">
					<Link passHref href="/admin/servers/new">
						<Button color="success" as="a">Add</Button>
					</Link>
				</Column>
			</Column.Group>

			{
				servers ? (
					<Box>
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
												<Link passHref href={`/admin/servers/${server.id as number}`}>
													<Button color="warning" as="a">
														<Icon size="small">
															<FontAwesomeIcon icon={faPen} color="black"/>
														</Icon>
													</Button>
												</Link>
											</Table.Cell>
										</Table.Row>
									))
								}
							</Table.Body>
						</Table>
					</Box>
				) : (
					<Progress color="primary"/>
				)
			}
		</Container>
	);
};

export default privateRoute(ServersPage);
