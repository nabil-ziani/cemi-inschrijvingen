'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils';
import { sidebarLinks } from '@/constants';
import { signOut } from '@/lib/actions/auth';

import { Tooltip } from '@heroui/react'
import { ArrowRightFromSquare } from '@gravity-ui/icons';

export function isSidebarLinkActive(pathname: string, route: string) {
	if (route === '/') return pathname === route
	return pathname.startsWith(route.split('/null')[0])
}

const Sidebar = () => {
	const pathname = usePathname();

	return (
		<section className="sticky left-0 top-0 flex h-screen w-[88px] flex-col justify-between bg-dark-1 px-3 py-4 text-white max-sm:hidden">
			<div className='mb-6'>
				<Link href='/' className='flex items-center'>
					<img
						src='/logo-mobile.png'
						width={60}
						height={60}
						alt='CEMI'
						className='max-sm:size-10'
					/>
				</Link>
			</div>
			<div className="flex flex-1 flex-col gap-4">
				{sidebarLinks.map((link) => {
					const isActive = isSidebarLinkActive(pathname, link.route)
					const Icon = isActive ? link.icons.active : link.icons.default

					return (
						<Tooltip key={link.label} content={link.label} placement="right" color="primary" size='lg'>
							<span className="inline-flex w-full">
								<Link
									href={link.route}
									className="flex mx-auto rounded-lg p-3 text-white transition-colors hover:bg-white/5"
								>
									<Icon width={26} height={26} className={cn('shrink-0', isActive ? 'text-white' : 'text-white/60')} aria-hidden />
								</Link>
							</span>
						</Tooltip>
					)
				})}
			</div>
			<div>
				<Tooltip content="Afmelden" placement="right" color="danger" size='lg'>
					<span className="inline-flex w-full">
						<span className="flex mx-auto rounded-full p-3 text-white bg-[#dc2626] transition-colors hover:bg-[#dc2626]/70 hover:cursor-pointer" onClick={signOut}>
							<ArrowRightFromSquare width={26} height={26} aria-hidden />
						</span>
					</span>
				</Tooltip>
			</div>
		</section>
	)
}

export default Sidebar
