import React, {useState} from 'react';
import Link from 'next/link';
import {Title, Container, Box, Block, Table, Button, Icon, Progress, Column, Tag} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import relativeDate from 'relative-date';
import {privateRoute} from '../../../components/private-route';
import {useAPIRoute, useAPI} from '../../../components/api-client-context';
import ModelTable from '../../../components/model-table';
import {IUser} from '../../../lib/types';

const UsersPage = () => {
	const {client} = useAPI();
	const users = useAPIRoute<IUser[]>('/api/users');

	const myEmail = client.token.decodedToken.email;

	return (
		<ModelTable
			title="Users"
			addHref="/admin/users/new"
			data={users}
			loading={users === undefined}
			headerLabels={['Email', 'Minecraft Username', 'Sponsored By', 'Roles', 'Is Banned', 'Last Login', 'Edit']}
			renderRow={user => (
				<Table.Row key={user.id}>
					<Table.Cell>{user.email}</Table.Cell>
					<Table.Cell>{user.minecraftUsername}</Table.Cell>
					<Table.Cell>
						{user.sponsoredByUserId !== null && (
							<Link href={`/admin/users/${user.sponsoredByUserId ?? ''}`}>
								{users?.find(u => u.id === user.sponsoredByUserId)?.minecraftUsername}
							</Link>
						)}
					</Table.Cell>
					<Table.Cell>
						<Tag.Group>
							{user.isMember && (<Tag color="info">Member</Tag>)}
							{user.isOfficer && (<Tag color="primary">Officer</Tag>)}
						</Tag.Group>
					</Table.Cell>
					<Table.Cell>{user.isBanned ? 'Yes' : 'No'}</Table.Cell>
					<Table.Cell>{relativeDate(new Date(user.lastLoggedInAt))}</Table.Cell>
					<Table.Cell>
						<Link passHref href={`/admin/users/${user.id}`}>
							<Button color="warning" as="a" disabled={user.email === myEmail} style={user.email === myEmail ? ({pointerEvents: 'none'}) : ({})}>
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
