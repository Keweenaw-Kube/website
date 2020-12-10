import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Breadcrumb} from 'rbx';

const Breadcrumbs = () => {
	const router = useRouter();

	const segments = router.asPath.split('/').slice(1);

	return (
		<Breadcrumb>
			{
				segments.map((s, i) => (
					<Link key={s} passHref href={`/${segments.slice(0, i + 1).join('/')}`}>
						<Breadcrumb.Item as="a" style={{textTransform: 'capitalize'}}>{s}</Breadcrumb.Item>
					</Link>
				))
			}
		</Breadcrumb>
	);
};

export default Breadcrumbs;
