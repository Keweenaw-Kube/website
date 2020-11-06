import React from 'react';
import {Hero, Container, Title, Button, Content} from 'rbx';
import Link from 'next/link';
import styles from './styles/index.module.scss';

export default function Home() {
	return (
		<Hero size="fullheight-with-navbar" className={styles.hero}>
			<div className={styles.heroBackground}/>
			<Hero.Body>
				<Container>
					<Title size={1} textColor="white">Keweenaw Kube</Title>

					<Content size="large">
						A Minecraft club at Michigan Tech.
					</Content>

					<Button.Group>
						<Link passHref href="/login">
							<Button color="primary" as="a">
								<strong>Join Whitelist</strong>
							</Button>
						</Link>

						<Link passHref href="/servers">
							<Button color="info" as="a">
								<strong>Server info</strong>
							</Button>
						</Link>
					</Button.Group>
				</Container>
			</Hero.Body>
		</Hero>
	);
}
