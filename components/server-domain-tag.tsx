import {Server} from 'https';
import React from 'react';
import {Tag, Icon} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCopy, faCheck} from '@fortawesome/free-solid-svg-icons';
import useCopyToClipboard from '../lib/use-copy-to-clipboard';

const ServerDomainTag = ({domain}: {domain: string}) => {
	const [isCopied, handleCopy] = useCopyToClipboard();

	return (
		<Tag.Group gapless>
			<Tag size="medium">{domain}</Tag>

			<Tag color={isCopied ? 'success' : 'info'} size="medium" style={{cursor: 'pointer'}} onClick={() => handleCopy(domain)}>
				<Icon size="small">
					<FontAwesomeIcon icon={isCopied ? faCheck : faCopy}/>
				</Icon>
			</Tag>
		</Tag.Group>
	);
};

export default ServerDomainTag;
