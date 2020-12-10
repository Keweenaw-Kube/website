import React from 'react';
import Link from 'next/link';
import {Title, Container, Box, Block, Table, Button, Icon, Progress, Column} from 'rbx';
import Breadcrumbs from './breadcrumbs';

const ModelTable = <T extends unknown>({loading = false, data, headerLabels = [], title, addHref, renderRow}: {loading: boolean; data?: T[]; headerLabels: string[]; title: string; addHref: string; renderRow: (row: T) => JSX.Element}) => (
	<Container>
		<Block/>

		<Breadcrumbs/>

		<Column.Group vcentered>
			<Column>
				<Title size={1}>{title}</Title>
			</Column>

			<Column narrow pull="right">
				<Link passHref href={addHref}>
					<Button color="success" as="a">Add</Button>
				</Link>
			</Column>
		</Column.Group>

		{
			data ? (
				<Box>
					<Table fullwidth>
						<Table.Head>
							<Table.Row>
								{
									headerLabels.map(label => (
										<Table.Heading key={label}>{label}</Table.Heading>
									))
								}
							</Table.Row>
						</Table.Head>

						{/* @ts-expect-error */}
						<Table.Body>
							{/* @ts-expect-error */}
							{data.map(element => renderRow(element))}
						</Table.Body>
					</Table>
				</Box>
			) : (
				<Progress color="primary"/>
			)
		}
	</Container>
);

export default ModelTable;
