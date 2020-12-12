import React from 'react';
import Link from 'next/link';
import {Navbar, Button, Icon} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDiscord} from '@fortawesome/free-brands-svg-icons';
import LoginButton from './login-button';
import {useAPI} from './api-client-context';

const MainNavbar = () => {
	const {client} = useAPI();

	const isLoggedIn = client.isAuthorized();
	const isOfficer = client.token.decodedToken.isOfficer;

	return (
		<Navbar>
			<Navbar.Brand>
				<Link passHref href="/">
					<Navbar.Item>
						<img
							src="/logo.svg"
							alt=""
							role="presentation"
							width="28"
							height="28"
						/>
					</Navbar.Item>
				</Link>
				<Navbar.Burger/>
			</Navbar.Brand>
			<Navbar.Menu>
				<Navbar.Segment align="start">
					<Link passHref href="/servers">
						<Navbar.Item>Servers</Navbar.Item>
					</Link>

					<Link passHref href="/about">
						<Navbar.Item>About</Navbar.Item>
					</Link>

					<Navbar.Item href="https://discord.gg/MNxSwZ45c4" title="Join our Discord server!">
						<Icon>
							<FontAwesomeIcon icon={faDiscord}/>
						</Icon>
					</Navbar.Item>
				</Navbar.Segment>

				<Navbar.Segment align="end">
					{
						isLoggedIn && (
							<Link passHref href="/dashboard">
								<Navbar.Item>Dashboard</Navbar.Item>
							</Link>
						)
					}

					{
						isOfficer && isLoggedIn && (
							<Link passHref href="/admin">
								<Navbar.Item>Admin</Navbar.Item>
							</Link>
						)
					}

					<Navbar.Item>
						<Button.Group>
							<LoginButton render={renderProps => (
								<Button color={renderProps.loggedIn ? 'danger' : 'primary'} disabled={renderProps.disabled} onClick={renderProps.onClick}>
									<strong>{renderProps.loggedIn ? 'Logout' : 'Login'}</strong>
								</Button>
							)}/>
						</Button.Group>
					</Navbar.Item>
				</Navbar.Segment>
			</Navbar.Menu>
		</Navbar>
	);
};

export default MainNavbar;
