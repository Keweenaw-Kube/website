import React from 'react';
import {Field, Control, Button} from 'rbx';

const FormActions = ({loading, onCancel, onDelete}: {loading: boolean; onCancel: () => void; onDelete?: () => void}) => (
	<Field kind="group">
		<Control>
			<Button {...(loading ? {state: 'loading'} : {})} color="primary" type="submit">Save</Button>
		</Control>

		<Control>
			<Button {...(loading ? {state: 'loading'} : {})} color="danger" type="button" onClick={onCancel}>Cancel</Button>
		</Control>

		{
			onDelete && (
				<Control style={{marginLeft: 'auto'}}>
					<Button {...(loading ? {state: 'loading'} : {})} color="danger" type="button" onClick={onDelete}>Delete</Button>
				</Control>
			)
		}
	</Field>
);

export default FormActions;
