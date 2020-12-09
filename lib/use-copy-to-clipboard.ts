import React from 'react';
import copy from 'copy-to-clipboard';

const RESET_INTERVAL = 1500;

export default function useCopyToClipboard(): [boolean, (text: string | number) => void] {
	const [isCopied, setCopied] = React.useState(false);

	const handleCopy = React.useCallback((text: string | number) => {
		if (typeof text === 'string' || typeof text === 'number') {
			copy(text.toString());
			setCopied(true);
		}
	}, []);

	React.useEffect(() => {
		let timeout: NodeJS.Timeout;

		if (isCopied) {
			timeout = setTimeout(() => setCopied(false), RESET_INTERVAL);
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [isCopied]);

	return [isCopied, handleCopy];
}
