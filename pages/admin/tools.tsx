import React, {useState, useCallback, useMemo} from 'react';
import {Container, Block, Title, Button, Modal, Box, Column} from 'rbx';
import {useSWRConfig} from 'swr';
import Breadcrumbs from '../../components/breadcrumbs';
import {privateRoute} from '../../components/private-route';
import {IUser} from '../../lib/types';
import {useAPIRoute, useAPI} from '../../components/api-client-context';

const AdminTools = () => {
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
	const [isMutating, setIsMutating] = useState(false);

	const {client} = useAPI();
	const users = useAPIRoute<IUser[]>('/api/users');
	const {mutate: mutateUsers} = useSWRConfig();

	const nonOfficers = useMemo(() => {
		if (!users) {
			return [];
		}

		return users.filter(user => !user.isOfficer);
	}, [users]);

	const removeNonOfficers = useCallback(async () => {
		setIsMutating(true);
		await client.deleteUsers(nonOfficers.map(user => user.id));
		await mutateUsers('/api/users');
		setIsMutating(false);
		setIsConfirmationModalOpen(false);
	}, [nonOfficers, mutateUsers, client]);

	return (
		<Container>
			<Block/>

			<Breadcrumbs/>

			<Title size={1}>Tools</Title>

			<Button color="danger" onClick={() => setIsConfirmationModalOpen(true)}>Remove all non-officers</Button>

			<Modal active={isConfirmationModalOpen} onClose={isMutating ? undefined : () => setIsConfirmationModalOpen(false)}>
				<Modal.Background/>
				<Modal.Content>
					<Box>
						<Title size={3}>Are you sure you want to remove all non-officers?</Title>

						<Column.Group>
							<Column>
								<Button state={isMutating ? 'loading' : undefined} onClick={() => setIsConfirmationModalOpen(false)}>Cancel</Button>
							</Column>

							<Column narrow pull="right">
								<Button color="danger" state={isMutating ? 'loading' : undefined} onClick={removeNonOfficers}>
									Remove {nonOfficers.length} non-officers
								</Button>
							</Column>
						</Column.Group>
					</Box>
				</Modal.Content>
				<Modal.Close/>
			</Modal>
		</Container>
	);
};

export default privateRoute(AdminTools);
