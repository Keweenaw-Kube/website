import React from 'react';
import {Message} from 'rbx';

const FormError = ({error}: {error?: string}) => {
	if (error && error !== '') {
		return (
			<Message color="danger">
				<Message.Body>
					{error}
				</Message.Body>
			</Message>
		);
	}

	return null;
};

export default FormError;
