import React from 'react';
import {Field, Control, Button} from 'rbx';

const FormActions = ({loading, onCancel}: {loading: boolean; onCancel: () => void}) => (
	<Field kind="group">
		<Control>
			<Button {...(loading ? {state: 'loading'} : {})} color="primary" type="submit">Save</Button>
		</Control>

		<Control>
			<Button {...(loading ? {state: 'loading'} : {})} color="danger" type="button" onClick={onCancel}>Cancel</Button>
		</Control>
	</Field>
);

export default FormActions;
