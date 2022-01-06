import React from 'react';
import {Field, Label, Control, Textarea, Input, Checkbox} from 'rbx';
import {Except} from 'type-fest';
import {useRouter} from 'next/router';
import FormActions from './form-actions';
import FormError from './form-error';
import ObjectAutosuggestSelector, {ObjectAutosuggestSelectorProps} from './object-autosuggest-selector';

interface IField {
	label: string;
	name: string;
	type: string;
	required?: boolean;
	disabled?: boolean;
}

interface IStringField extends IField {
	value: string;
	type: 'input';
}

interface IEmailField extends IField {
	value: string;
	type: 'email';
}

interface ITextareaField extends IField {
	value: string;
	type: 'textarea';
}

interface ICheckboxField extends IField {
	value: boolean;
	type: 'checkbox';
}

interface IObjectSelectField extends IField {
	type: 'object-select';
	value: ObjectAutosuggestSelectorProps<any>['selection'];
	objectSelect: Except<ObjectAutosuggestSelectorProps<any>, 'label'>;
}

export type IFieldDefinition = IStringField | IEmailField | ITextareaField | ICheckboxField | IObjectSelectField;

const renderField = (field: IFieldDefinition, onChange: (v: string | boolean) => void) => {
	switch (field.type) {
		case 'textarea':
			return (
				<Textarea value={field.value} required={field.required} disabled={field.disabled} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}/>
			);
		case 'checkbox':
			return (
				<Checkbox checked={field.value} disabled={field.disabled} onChange={() => onChange(!field.value)}/>
			);
		case 'email':
			return (
				<Input type="email" value={field.value} required={field.required} disabled={field.disabled} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}/>
			);
		case 'object-select':
			return (
				<ObjectAutosuggestSelector
					label={field.label}
					selection={field.value}
					{...field.objectSelect}/>
			);
		default:
			return (
				<Input type="text" value={field.value} required={field.required} disabled={field.disabled} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}/>
			);
	}
};

const WrappedField = ({field, onChange}: {field: IFieldDefinition; onChange: (v: string | boolean) => void}) => (
	<Field>
		{
			field.type !== 'object-select' && (
				<Label>{field.label}</Label>
			)
		}

		<Control>
			{renderField(field, onChange)}
		</Control>
	</Field>
);

const ModelEdit = ({fields = [], onChange, loading = false, backHref, onCancel = () => { /* default value */ }, onDelete, errorMsg = ''}: {fields: IFieldDefinition[]; onChange: (name: string, value: string | boolean) => void; loading: boolean; backHref?: string; onCancel?: () => void; onDelete?: () => void; errorMsg?: string}) => {
	const router = useRouter();

	return (
		<>
			<FormError error={errorMsg}/>

			{
				fields.map(field => (
					<WrappedField key={field.name} field={field} onChange={v => onChange(field.name, v)}/>
				))
			}

			<FormActions loading={loading} onCancel={backHref ? async () => router.push(backHref) : onCancel} onDelete={onDelete}/>
		</>
	);
};

export default ModelEdit;
