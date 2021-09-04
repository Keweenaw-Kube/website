import React from 'react';
import Image from 'next/image';
import {GetServerSideProps} from 'next';
import {Container, Block, Title, Button} from 'rbx';
import prisma from '../api/lib/db';
import {IPicture, IServer} from '../../lib/types';
import ServerDomainTag from '../../components/server-domain-tag';
import TilesGrid from '../../components/tiles-grid';
import Breadcrumbs from '../../components/breadcrumbs';
import styles from './styles/[id].module.scss';
import {NextSeo} from 'next-seo';

export const getServerSideProps: GetServerSideProps = async context => {
	const server = await prisma.server.findFirst({
		where: {
			id: Number.parseInt(context.params?.id as string, 10)
		},
		include: {
			pictures: {
				orderBy: {createdAt: 'desc'}
			}
		}
	});

	return {
		props: {
			server: JSON.stringify(server)
		}
	};
};

interface IServerWithPictures extends IServer {
	pictures: IPicture[];
}

const SpecificServerPage = ({server: propServer}: {server: string}) => {
	const server: IServerWithPictures = JSON.parse(propServer);

	console.log(server);

	return (
		<Container>
			<Block/>

			<Breadcrumbs/>

			<Title size={1}>{server.name}</Title>

			<ServerDomainTag size="medium" {...server}/>

			<p style={{maxWidth: '60ch'}}>{server.description}</p>

			<Block/>

			<TilesGrid
				items={server.pictures} renderItem={(picture, i) => (
					<div className={styles.pictureContainer}>
						<Image src={picture.path} width={picture.width} height={picture.height} layout="responsive" loading={i < 4 ? 'eager' : 'lazy'}/>

						<div className={styles.pictureCaption}>{picture.caption}</div>
					</div>
				)}/>

			<NextSeo
				title={server.name}
				description={server.description}/>
		</Container>
	);
};

export default SpecificServerPage;
