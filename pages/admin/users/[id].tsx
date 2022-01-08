import React, {useMemo, useState} from 'react';
import {NextPage} from 'next';
import Link from 'next/link';
import {Container, Block, Title, Button, Column, Icon, Select, Table} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import sd from 'simple-duration';
import {format} from 'date-fns';
import {CalendarTooltipProps, ResponsiveCalendar} from '@nivo/calendar';
import {useAPIRoute, useAPI} from '../../../components/api-client-context';
import {privateRoute} from '../../../components/private-route';
import {APIClient} from '../../../lib/api-client';
import {IUserWithSponsorInfo} from '../../../lib/types';
import Breadcrumbs from '../../../components/breadcrumbs';
import {ISession} from '../../api/lib/get-user-sessions';
import {UserConnectionHistory} from '@prisma/client';

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_MS = ONE_DAY_MS * 7;

const CustomCalendarTooltip = (data: CalendarTooltipProps) => {
	return (
		<span style={{color: 'white', backgroundColor: 'black', padding: '10px'}}>
			{data.day} : {sd.stringify(Number.parseInt(data.value, 10) / 1000, 'm')}
		</span>
	);
};

const ViewUser: NextPage<{user: IUserWithSponsorInfo}> = ({user}) => {
	const {client} = useAPI();
	const [filterPeriodMs, setFilterPeriodMs] = useState(ONE_MONTH_MS * 4);

	const sessionUrlWithFilters = useMemo(() => {
		if (typeof window === 'undefined') {
			return null;
		}

		const url = new URL(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/users/${user.id}/sessions`);

		if (filterPeriodMs !== 0) {
			url.searchParams.set('after', new Date(Date.now() - filterPeriodMs).toISOString());
		}

		return url;
	}, [user, filterPeriodMs]);

	const connectionHistoryUrlWithFilters = useMemo(() => {
		if (sessionUrlWithFilters) {
			const url = new URL(sessionUrlWithFilters);
			url.pathname = `/api/users/${user.id}/connection-history`;
			url.searchParams.set('order', 'desc');
			return url;
		}

		return null;
	}, [sessionUrlWithFilters, user.id]);

	const sessions = useAPIRoute<ISession[]>(sessionUrlWithFilters?.toString() ?? null);
	const connectionHistory = useAPIRoute<UserConnectionHistory[]>(connectionHistoryUrlWithFilters?.toString() ?? null);

	const myEmail = client.token.decodedToken.email;

	const totalSessionLength = useMemo(() => {
		if (sessions && sessions.length > 0) {
			const total = sessions.reduce((acc, s) => acc + (new Date(s.end).getTime() - new Date(s.start).getTime()), 0);
			return total;
		}

		return null;
	}, [sessions]);

	const averageSessionLength = useMemo(() => {
		if (totalSessionLength && sessions) {
			return Math.round(totalSessionLength / sessions.length);
		}

		return null;
	}, [totalSessionLength, sessions]);

	const totalSessionLengthPerDate = useMemo(() => {
		if (sessions && sessions.length > 0) {
			const totalSessionLengthPerDate = sessions.reduce<Record<string, number>>((acc, s) => {
				const date = new Date(s.start);
				const dateString = format(date, 'yyyy-MM-dd');

				if (!acc[dateString]) {
					acc[dateString] = 0;
				}

				acc[dateString] += (new Date(s.end).getTime() - new Date(s.start).getTime());

				return acc;
			}, {});

			return Object.entries(totalSessionLengthPerDate).reduce<Array<{day: string; value: number}>>((acc, [day, value]) => {
				acc.push({
					day,
					value
				});

				return acc;
			}, []);
		}

		return null;
	}, [sessions]);

	return (
		<Container>
			<Block/>

			<Breadcrumbs/>

			<Column.Group>
				<Column>
					<Title size={1}>{user.minecraftUsername}</Title>
					<Title size={3} textColor="grey-light">{user.email}</Title>
				</Column>

				<Column narrow pull="right">
					<Link passHref href={`/admin/users/edit/${user.id}`}>
						<Button color="warning" as="a" disabled={user.email === myEmail} style={user.email === myEmail ? ({pointerEvents: 'none'}) : ({})}>
							<Icon size="small">
								<FontAwesomeIcon icon={faPen} color="black"/>
							</Icon>
						</Button>
					</Link>
				</Column>
			</Column.Group>

			<Block style={{marginBottom: '3rem'}}/>

			{
				user.sponsoring.length > 0 && (
					<>
						<Title size={2}>Sponsoring</Title>

						{
							user.sponsoring.map((sponsoredUser, i) => (
								<span key={sponsoredUser.id}>
									<Link href={`/admin/users/${sponsoredUser.id}`}>
										{sponsoredUser.minecraftUsername}
									</Link>
									{i !== user.sponsoring.length - 1 && <span>, </span>}
								</span>
							))
						}

						<Block style={{marginBottom: '3rem'}}/>
					</>
				)
			}

			<Title size={2}>Stats</Title>

			<Column.Group vcentered>
				<Column>
					{
						averageSessionLength && (
							<Title size={4}>Average Session Length: {sd.stringify(averageSessionLength / 1000, 'm')}</Title>
						)
					}
					{
						totalSessionLength && (
							<Title size={4}>Total Time Spent: {sd.stringify(totalSessionLength / 1000, 'm')}</Title>
						)
					}
				</Column>

				<Column narrow pull="right">
					<Select.Container>
						<Select value={filterPeriodMs} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setFilterPeriodMs(Number.parseInt(event.target.value, 10))}>
							<Select.Option value={0}>within all of time</Select.Option>
							<Select.Option value={ONE_MONTH_MS * 4}>within the last 4 months</Select.Option>
							<Select.Option value={ONE_MONTH_MS}>within the last month</Select.Option>
							<Select.Option value={ONE_WEEK_MS}>within the last week</Select.Option>
							<Select.Option value={ONE_DAY_MS}>within the last day</Select.Option>
						</Select>
					</Select.Container>
				</Column>
			</Column.Group>

			{
				totalSessionLengthPerDate && totalSessionLengthPerDate.length > 0 && (
					<div style={{height: 400}}>
						<ResponsiveCalendar
							tooltip={CustomCalendarTooltip}
							from={new Date(Date.now() - filterPeriodMs).toLocaleDateString()}
							to={new Date().toLocaleDateString()}
							data={totalSessionLengthPerDate}
							emptyColor="#eeeeee"
							colors={['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']}
							margin={{top: 40, right: 40, bottom: 40, left: 40}}
							yearSpacing={40}
							monthBorderColor="#ffffff"
							dayBorderWidth={2}
							dayBorderColor="#ffffff"
						/>
					</div>
				)
			}

			<Block style={{marginBottom: '3rem'}}/>

			<Title size={2}>Connection Events</Title>

			<Table style={{marginBottom: '3rem'}}>
				<Table.Head>
					<Table.Row>
						<Table.Heading>Event</Table.Heading>
						<Table.Heading>Time</Table.Heading>
					</Table.Row>
				</Table.Head>

				{/* @ts-expect-error */}
				<Table.Body>
					{/* @ts-expect-error */}
					{connectionHistory?.map(event => (
						<Table.Row key={event.id}>
							<Table.Cell>{event.event}</Table.Cell>
							<Table.Cell>{new Date(event.createdAt).toLocaleString()}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		</Container>
	);
};

ViewUser.getInitialProps = async context => {
	const id = Number.parseInt((context.query.id as string), 10);

	const client = new APIClient(context);

	const user = await client.getUser(id);

	// TODO: handle 404s properly

	return {user};
};

export default privateRoute<{user: IUserWithSponsorInfo}>(ViewUser);
