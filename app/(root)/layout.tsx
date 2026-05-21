import React, { ReactNode } from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: "CEMI",
	description: "Website voor leerlingen in te schrijven",
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
	return (
		<main className='light text-foreground bg-background'>
			{children}
		</main>
	);
}

export default RootLayout