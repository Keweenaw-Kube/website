import React from 'react';
import Link from 'next/link';
import {Title, Container, Box, Block} from 'rbx';
import {useAPI} from '../../components/api-client-context';
import {privateRoute} from '../../components/private-route';

const LINKS = [
	{
		label: 'Servers',
		href: '/admin/servers'
	},
	{
		label: 'Users',
		href: '/admin/users'
	},
	{
		label: 'Pictures',
		href: '/admin/pictures'
	},
	{
		label: 'Tools',
		href: '/admin/tools'
	},
	{
		label: 'Auth Tokens',
		href: '/admin/tokens'
	}
];

const AdminHome = () => {
	const {client} = useAPI();

	return (
		<Container>
			<Block/>

			<Title size={1}>Hello, {client.token.decodedToken.name}.</Title>

			<Block/>
			{
				LINKS.map(link => (
					<Link key={link.href} passHref href={link.href}>
						<Box as="a" style={{display: 'flex'}}>
							<div>
								<strong>{link.label}</strong>
							</div>
							<div style={{marginLeft: 'auto'}}>
								<strong>→</strong>
							</div>
						</Box>
					</Link>
				))
			}
		</Container>
	);
};

export default privateRoute(AdminHome);
