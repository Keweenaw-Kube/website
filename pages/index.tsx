import React from 'react';
import {GetServerSideProps} from 'next';
import Image from 'next/image';
import {Hero, Container, Title, Button, Content, Generic} from 'rbx';
import Link from 'next/link';
import prisma from './api/lib/db';
import styles from './styles/index.module.scss';
import {IPicture} from '../lib/types';
import {getRandomInt} from '../lib/helpers';
import LoginButton from '../components/login-button';
import {useAPI} from '../components/api-client-context';

export const getServerSideProps: GetServerSideProps = async context => {
	const count = await prisma.picture.count({where: {isApproved: true}});
	const picture = await prisma.picture.findFirst({orderBy: {id: 'desc'}, where: {isApproved: true}, skip: getRandomInt(0, count - 1)});

	return {
		props: {
			picture: picture ? {id: picture.id, path: picture.path, width: picture.width, height: picture.height} : null
		}
	};
};

export default function Home({picture}: {picture?: IPicture}) {
	const {client} = useAPI();

	const isLoggedIn = client.isAuthorized();

	return (
		<Hero size="fullheight-with-navbar" className={styles.hero}>
			<div className={styles.heroBackground}>
				{picture && <Image priority src={picture.path} layout="fill" objectFit="cover"/>}
			</div>

			<Hero.Body>
				<Container>
					<Title size={1} textColor="white">Keweenaw Kube</Title>

					<Content size="large">
						A Minecraft club at Michigan Tech.
					</Content>

					<Button.Group>
						{
							isLoggedIn ? (
								<Link passHref href="/dashboard">
									<Button color="primary" as="a" size="medium">
										<Generic textColor="black"><strong>Join Whitelist</strong></Generic>
									</Button>
								</Link>
							) : (
								<LoginButton render={renderProps => (
									<Button color="primary" size="medium" disabled={renderProps.disabled} onClick={renderProps.onClick}>
										<Generic textColor="black"><strong>Join Whitelist</strong></Generic>
									</Button>
								)}/>
							)
						}

						<Link passHref href="/servers">
							<Button color="info" as="a" size="medium">
								<strong>Server info</strong>
							</Button>
						</Link>
					</Button.Group>
				</Container>
			</Hero.Body>
		</Hero>
	);
}
