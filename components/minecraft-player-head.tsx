import React from 'react';
import {Image} from 'rbx';

const MinecraftPlayerHead = ({uuid}: {uuid: string}) => {
	const url = `https://crafatar.com/renders/head/${uuid}`;

	return (
		<Image.Container size={128}>
			<Image src={url}/>
		</Image.Container>
	);
};

export default MinecraftPlayerHead;
