import React from 'react';
import {Table, Button, Icon} from 'rbx';
import {mutate} from 'swr';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import TimeAgo from 'timeago-react';
import {privateRoute} from '../../../components/private-route';
import {useAPI, useAPIRoute} from '../../../components/api-client-context';
import ModelTable from '../../../components/model-table';
import {IToken} from '../../../lib/types';

const TokensPage = () => {
	const tokens = useAPIRoute<IToken[]>('/api/tokens');
	const {client} = useAPI();

	const handleDelete = async (token: string) => {
		await client.deleteToken(token);
		await mutate('/api/tokens');
	};

	return (
		<ModelTable
			title="Tokens"
			addHref="/admin/tokens/new"
			data={tokens}
			loading={tokens === undefined}
			headerLabels={['Name', 'Token', 'Last Used', 'Delete']}
			renderRow={token => (
				<Table.Row key={token.token}>
					<Table.Cell>{token.name}</Table.Cell>
					<Table.Cell>{token.token}</Table.Cell>
					<Table.Cell><TimeAgo datetime={token.lastUsedAt}/></Table.Cell>
					<Table.Cell>
						<Button color="danger" onClick={async () => handleDelete(token.token)}>
							<Icon size="small">
								<FontAwesomeIcon icon={faTrash} color="white"/>
							</Icon>
						</Button>
					</Table.Cell>
				</Table.Row>
			)}
		/>
	);
};

export default privateRoute(TokensPage);
