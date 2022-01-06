import React, {useState, useCallback, useMemo, useEffect} from 'react';
import Autosuggest, {ChangeEvent} from 'react-autosuggest';
import {Field, Label, Button, Input} from 'rbx';
import {ConditionalKeys} from 'type-fest';
import {useAPIRoute} from './api-client-context';
import styles from './styles/object-autosuggest-selector.module.scss';

export type ModelWithId = {
	id: number;
};

export interface ObjectAutosuggestSelectorProps<T extends ModelWithId> {
	apiPath: string;
	renderSuggestion: (s: T) => React.ReactNode;
	getSuggestionValue: (s: T) => string;
	placeholder: string;
	onSelection: (s: T) => void;
	onClear?: () => void;
	label: string;
	selection?: T | null;
	searchFields: Array<ConditionalKeys<T, string | null>>;
	filter?: (s: T) => boolean;
}

const ObjectAutosuggestSelector = <T extends ModelWithId>({apiPath, renderSuggestion, getSuggestionValue, placeholder, onSelection, onClear, label, selection, searchFields, filter}: ObjectAutosuggestSelectorProps<T>) => {
	const apiResults = useAPIRoute<T[]>(apiPath);
	const [inputValue, setInputValue] = useState('');
	const [suggestions, setSuggestions] = useState<T[]>([]);
	const [isSuggesting, setIsSuggesting] = useState(false);

	const updateSuggestions = useCallback((value: string) => {
		if (apiResults) {
			setSuggestions(apiResults.filter(result => {
				if (filter) {
					if (!filter(result)) {
						return false;
					}
				}

				let include = false;

				searchFields.forEach(field => {
					// TODO: improve typings
					if (result[field] && typeof result[field] === 'string') {
						if ((result[field] as unknown as string).toLowerCase().includes(value.toLowerCase())) {
							include = true;
						}
					}
				});

				return include;
			}));
		}
	}, [apiResults, searchFields]);

	const inputProps = {
		placeholder,
		value: inputValue,
		onChange: (_: React.FormEvent<any>, {newValue}: ChangeEvent) => setInputValue(newValue)
	};

	const handleAction = useCallback(() => {
		if (isSuggesting) {
			setInputValue('');
			setIsSuggesting(false);
		} else {
			setIsSuggesting(true);

			if (selection) {
				setInputValue(getSuggestionValue(selection));
			}
		}
	}, [isSuggesting, selection, getSuggestionValue]);

	const handleClear = useCallback(() => {
		if (onClear) {
			setIsSuggesting(false);
			onClear();
		}
	}, [onClear]);

	return (
		<Field>
			<Label>{label}</Label>

			<div style={{display: 'flex', alignContent: 'center'}}>
				{isSuggesting && (
					<Autosuggest
						alwaysRenderSuggestions
						suggestions={suggestions}
						getSuggestionValue={getSuggestionValue}
						renderSuggestion={renderSuggestion}
						inputProps={inputProps}
						/*
            // @ts-expect-error */
						renderInputComponent={inputProps => <Input autoFocus {...inputProps}/>}
						theme={styles}
						onSuggestionsFetchRequested={({value}) => updateSuggestions(value)}
						onSuggestionsClearRequested={() => setSuggestions([])}
						onSuggestionSelected={(_, {suggestion}) => {
							setIsSuggesting(false);
							onSelection(suggestion);
						}}
					/>
				)}

				{selection && !isSuggesting && <Input disabled value={getSuggestionValue(selection)} style={{width: 'auto'}}/>}

				<Button type="button" color="info" style={isSuggesting || selection ? ({marginLeft: '1rem'}) : {}} onClick={handleAction}>{isSuggesting ? 'Cancel' : (selection ? 'Edit' : 'Select')}</Button>

				{
					(isSuggesting && onClear) && (
						<Button type="button" color="danger" style={{marginLeft: '1rem'}} onClick={handleClear}>
							Clear
						</Button>
					)
				}
			</div>
		</Field>
	);
};

export default ObjectAutosuggestSelector;
