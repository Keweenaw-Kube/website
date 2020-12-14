import React from 'react';
import {Container, Block, Title} from 'rbx';

const AboutPage = () => (
	<Container>
		<Block/>

		<Title size={1}>About Us</Title>

		<p>
			We&apos;re dedicated to the operation and hosting of Minecraft servers, both for ourselves and the wider Michigan Tech community. Hosting is kindly provided by <a href="https://wmtu.fm/">WMTU</a>, an on-campus radio station.
		</p>

		<Block/>

		<p>
			If you&apos;re interested in becoming a member or want to reach out, <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE}>join our Discord server</a> or email <a href="mailto:kube@mtu.edu">kube@mtu.edu</a>.
		</p>
	</Container>
);

export default AboutPage;
