import React from 'react';
import {Box, Column} from 'rbx';
import styles from './styles/tiles-grid.module.scss';

const getOffsetedElements = <T extends Record<string, unknown>>(arr: T[], offset = 0): T[] => {
	const temp = [];

	for (let i = offset; i < arr.length; i += 2) {
		temp.push(arr[i]);
	}

	return temp;
};

const TilesGrid = <T extends {id: number}>({items, renderItem}: {items: T[]; renderItem: (item: T, index: number) => React.ReactElement}) => {
	return (
		<Column.Group>
			<Column>
				{getOffsetedElements(items).map((item, i) => (
					<Box key={item.id} className={styles.box}>
						{renderItem(item, i * 2)}
					</Box>
				))}
			</Column>

			<Column>
				{getOffsetedElements(items, 1).map((item, i) => (
					<Box key={item.id} className={styles.box}>
						{renderItem(item, (i * 2) + 1)}
					</Box>
				))}
			</Column>
		</Column.Group>
	);
};

export default TilesGrid;
