import React from 'react';
import Link from 'next/link';
import {Title, Container, Box, Block} from 'rbx';
import {useAPI} from '../../components/api-client-context';
import {privateRoute} from '../../components/private-route';

const LINKS = [
	{
		label: 'Edit servers',
		href: '/admin/servers'
	},
	{
		label: 'Edit users',
		href: '/admin/users'
	},
	{
		label: 'Edit pictures',
		href: '/admin/pictures'
	},
	{
		label: 'Edit roles',
		href: '/admin/roles'
	}
];

const AdminHome = () => {
	const [client] = useAPI();

	return (
		<Container>
			<Block/>

			<Title size={1}>Hi, {client.token.decodedToken.name}</Title>

			<Block/>
			{
				LINKS.map(link => (
					<Link key={link.href} href={link.href}>
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
