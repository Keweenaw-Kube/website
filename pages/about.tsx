import React from 'react';
import {Container, Block, Title, Content} from 'rbx';

const AboutPage = () => (
	<Container as={Content}>
		<Block/>

		<Title size={1}>About Us</Title>

		<p>
			We&apos;re dedicated to the operation and hosting of Minecraft servers, both for ourselves and the wider Michigan Tech community. Hosting is kindly provided by <a href="https://wmtu.fm/">WMTU</a>, an on-campus radio station.
		</p>

		<Block/>

		<p>
			If you&apos;re interested in becoming a member or want to reach out, <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE}>join our Discord server</a> or email <a href="mailto:kube@mtu.edu">kube@mtu.edu</a>.
		</p>

		<Block/>

		<p>
			Our code is open-source and can be found at <a href="https://github.com/Keweenaw-Kube">github.com/Keweenaw-Kube</a>.
		</p>

		<Block/>

		<p>
			All servers that we run have <a href="https://modrepo.de/minecraft/voicechat">Simple Voice Chat</a> installed. Simple Voice Chat provides a number of benefits over other voice services like Discord: low latency, high audio quality, spatial audio, and proximity chat. If you want to use Simple Voice Chat:
			<ol>
				<li>Install the <a href="https://fabricmc.net/use/">Fabric Loader</a></li>
				<li>Add the <a href="https://www.curseforge.com/minecraft/mc-mods/fabric-api">Fabric API</a> to your mods folder</li>
				<li>Add <a href="https://www.curseforge.com/minecraft/mc-mods/simple-voice-chat/files/all">Simple Voice Chat</a> to your mods folder</li>
				<li>
					After joining a server, you can adjust voice settings by pressing <code>v</code>
				</li>
			</ol>

			If you would like to use OptiFine as well, you can add <a href="https://www.curseforge.com/minecraft/mc-mods/optifabric">OptiFabric</a> & <a href="https://optifine.net/downloads">OptiFine</a> to your mods folder.
		</p>
	</Container>
);

export default AboutPage;
