import React, {useMemo} from 'react';
import {Tag, Icon} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCopy, faCheck} from '@fortawesome/free-solid-svg-icons';
import useCopyToClipboard from '../lib/use-copy-to-clipboard';
import {IServer} from '../lib/types';

const ServerDomainTag = ({size = 'medium', hasText = true, ...server}: {size?: 'normal' | 'medium' | 'large'; hasText?: boolean} & IServer) => {
	const [isCopied, handleCopy] = useCopyToClipboard();

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		handleCopy(server.domain);
	};

	const tagColor = useMemo(() => {
		if (server.isArchived) {
			return 'dark';
		}

		if (server.limitToMembers) {
			return 'warning';
		}

		return 'success';
	}, [server]);

	const tagText = useMemo(() => {
		if (server.isArchived) {
			return 'Archived';
		}

		if (server.limitToMembers) {
			return 'Members Only';
		}

		return 'Open to Everyone';
	}, [server]);

	return (
		<Tag.Group gapless>
			{
				hasText && (
					<Tag color={tagColor} size={size}>{tagText}</Tag>
				)
			}

			{
				server.isArchived && server.archiveFileUrl && (
					<Tag size={size} as="a" href={server.archiveFileUrl} target="_blank">Download World</Tag>
				)
			}

			{
				!server.isArchived && (
					<>
						<Tag size={size}>{server.domain}</Tag>
						<Tag color={isCopied ? 'success' : 'info'} size={size} style={{cursor: 'pointer'}} onClick={handleClick}>
							<Icon size="small">
								<FontAwesomeIcon icon={isCopied ? faCheck : faCopy}/>
							</Icon>
						</Tag>
					</>
				)
			}
		</Tag.Group>
	);
};

export default ServerDomainTag;
