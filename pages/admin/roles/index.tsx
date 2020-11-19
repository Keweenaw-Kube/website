import React from 'react';
import Link from 'next/link';
import {Title, Container, Box, Block, Table, Button, Icon, Progress, Column} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import {privateRoute} from '../../../components/private-route';
import {useAPIRoute} from '../../../components/api-client-context';
import ModelTable from '../../../components/model-table';
import {IRole} from '../../../lib/types';

const Roles = () => {
	const roles = useAPIRoute<IRole[]>('/api/roles');

	return (
		<ModelTable
			title="Roles"
			addHref="/admin/roles/new"
			data={roles}
			loading={roles === undefined}
			headerLabels={['Name', 'Edit']}
			renderRow={role => (
				<Table.Row key={role.id}>
					<Table.Cell>{role.name}</Table.Cell>
					<Table.Cell>
						<Link passHref href={`/admin/roles/${role.id}`}>
							<Button color="warning" as="a">
								<Icon size="small">
									<FontAwesomeIcon icon={faPen} color="black"/>
								</Icon>
							</Button>
						</Link>
					</Table.Cell>
				</Table.Row>
			)}
		/>
	);
};

export default privateRoute(Roles);
