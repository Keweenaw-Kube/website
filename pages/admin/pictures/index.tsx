import React from 'react';
import Image from 'next/image';
import {Title, Container, Box, Block, Table, Button, Icon, Progress, Column, Tag} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen, faTrash} from '@fortawesome/free-solid-svg-icons';
import {privateRoute} from '../../../components/private-route';
import {useAPIRoute} from '../../../components/api-client-context';
import ModelTable from '../../../components/model-table';
import {IPicture} from '../../../lib/types';

const MAX_DIMENSION = 512;

const getDimensions = (width: number, height: number) => {
	let scale = 1;

	scale = width > height ? MAX_DIMENSION / width : MAX_DIMENSION / height;

	return {width: width * scale, height: height * scale};
};

const PicturesPage = () => {
	const pictures = useAPIRoute<IPicture[]>('/api/pictures');

	return (
		<ModelTable
			title="Pictures"
			addHref="/admin/pictures/new"
			data={pictures}
			loading={pictures === undefined}
			headerLabels={['Preview', 'Status', 'Edit']}
			renderRow={picture => (
				<Table.Row key={picture.id}>
					<Table.Cell>
						<Image src={picture.path} {...getDimensions(picture.width, picture.height)}/>
					</Table.Cell>

					<Table.Cell style={{verticalAlign: 'middle'}}>
						<Tag color={picture.isApproved ? 'success' : 'light'}>{picture.isApproved ? 'Approved' : 'Pending approval'}</Tag>
					</Table.Cell>

					<Table.Cell style={{verticalAlign: 'middle'}}>
						<Button color="warning">
							<Icon size="small">
								<FontAwesomeIcon icon={faPen} color="black"/>
							</Icon>
						</Button>
					</Table.Cell>
				</Table.Row>
			)}
		/>
	);
};

export default privateRoute(PicturesPage);
