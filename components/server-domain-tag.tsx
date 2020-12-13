import {Server} from 'https';
import React from 'react';
import {Tag, Icon} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCopy, faCheck} from '@fortawesome/free-solid-svg-icons';
import useCopyToClipboard from '../lib/use-copy-to-clipboard';

const ServerDomainTag = ({domain, size = 'medium', extraTag}: {domain: string; size?: 'normal' | 'medium' | 'large'; extraTag?: React.ReactElement}) => {
	const [isCopied, handleCopy] = useCopyToClipboard();

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		handleCopy(domain);
	};

	return (
		<Tag.Group gapless>
			{extraTag}

			<Tag size={size}>{domain}</Tag>

			<Tag color={isCopied ? 'success' : 'info'} size={size} style={{cursor: 'pointer'}} onClick={handleClick}>
				<Icon size="small">
					<FontAwesomeIcon icon={isCopied ? faCheck : faCopy}/>
				</Icon>
			</Tag>
		</Tag.Group>
	);
};

export default ServerDomainTag;
