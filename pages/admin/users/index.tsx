import React, {useState} from 'react';
import Link from 'next/link';
import {Title, Container, Box, Block, Table, Button, Icon, Progress, Column, Generic} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import {privateRoute} from '../../../components/private-route';
import {useAPIRoute, useAPI} from '../../../components/api-client-context';
import ModelTable from '../../../components/model-table';
import {IUser} from '../../../lib/types';

const UsersPage = () => {
	const users = useAPIRoute<IUser[]>('/api/users');

	return (
		<ModelTable
			title="Users"
			addHref="/admin/users/new"
			data={users}
			loading={users === undefined}
			headerLabels={['Email', 'Minecraft Username', 'Is Officer', 'Is Banned', 'Edit']}
			renderRow={user => (
				<Table.Row key={user.id}>
					<Table.Cell>{user.email}</Table.Cell>
					<Table.Cell>{user.minecraftUsername}</Table.Cell>
					<Table.Cell>{user.isOfficer ? 'Yes' : 'No'}</Table.Cell>
					<Table.Cell>{user.isBanned ? 'Yes' : 'No'}</Table.Cell>
					<Table.Cell>
						<Link passHref href={`/admin/users/${user.id}`}>
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

export default privateRoute(UsersPage);
