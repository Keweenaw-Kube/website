import React from 'react';
import {Field, Label, Control, Textarea, Input, Button} from 'rbx';
import {useRouter} from 'next/router';
import FormActions from './form-actions';

type TInputType = 'input' | 'textarea';

const WrappedField = ({label, value, onChange, as}: {label: string; value: string; onChange: (v: string) => void; as?: TInputType}) => (
	<Field>
		<Label>{label}</Label>
		<Control>
			{
				as === 'textarea' ? (
					<Textarea value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}/>
				) : (
					<Input type="text" value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}/>
				)
			}
		</Control>
	</Field>
);

interface IFieldDefinition {
	label: string;
	name: string;
	value: string;
	type?: TInputType;
}

const ModelEdit = ({fields = [], onChange, loading = false, backHref, onCancel = () => { /* default value */ }}: {fields: IFieldDefinition[]; onChange: (name: string, value: string) => void; loading: boolean; backHref?: string; onCancel?: () => void}) => {
	const router = useRouter();

	return (
		<>
			{
				fields.map(field => (
					<WrappedField key={field.name} label={field.label} value={field.value} as={field.type} onChange={v => onChange(field.name, v)}/>
				))
			}

			<FormActions loading={loading} onCancel={backHref ? async () => router.push(backHref) : onCancel}/>
		</>
	);
};

export default ModelEdit;
