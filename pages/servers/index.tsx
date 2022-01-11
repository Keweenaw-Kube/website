import React from 'react';
import {GetServerSideProps} from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {Container, Block, Box, Title, Column, Icon, Generic} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons';
import prisma from '../api/lib/db';
import {IServer, IPicture} from '../../lib/types';
import styles from './styles/index.module.scss';
import ServerDomainTag from '../../components/server-domain-tag';

export const getServerSideProps: GetServerSideProps = async context => {
	const servers = await prisma.server.findMany({
		include: {
			pictures: {
				take: 1,
				orderBy: {createdAt: 'desc'}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return {
		props: {
			servers: JSON.stringify(servers)
		}
	};
};

interface IServerWithPictures extends IServer {
	pictures: IPicture[];
}

const ServersPage = ({servers: propServers}: {servers: string}) => {
	const router = useRouter();
	const servers: IServerWithPictures[] = JSON.parse(propServers);

	return (
		<div>
			<Block/>

			{
				servers.map((server, i) => (
					<Container key={server.id} className={styles.cardContainer}>
						<Box className={styles.card} onClick={async () => router.push(`/servers/${server.id}`)}>
							<div className={styles.cardBackground}>
								{server.pictures[0] && (
									<Image loading={i < 2 ? 'eager' : undefined} src={server.pictures[0].path} layout="fill" objectFit="cover"/>
								)}
							</div>

							<div className={styles.cardContent}>
								<Column.Group vcentered style={{minHeight: '100%', margin: 0}}>
									<Column style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
										<div style={{marginBottom: '1.5rem'}}>
											<Title size={2} textColor="white" style={{marginBottom: '0.5rem'}}>{server.name}</Title>

											<ServerDomainTag {...server} size="medium"/>
										</div>

										<p>
											{server.description}
										</p>
									</Column>

									<Column>
										<Generic pull="right">
											<Icon style={{fontSize: '2rem'}}>
												<FontAwesomeIcon icon={faChevronRight}/>
											</Icon>
										</Generic>
									</Column>
								</Column.Group>
							</div>
						</Box>
					</Container>
				))
			}
		</div>
	);
};

export default ServersPage;
