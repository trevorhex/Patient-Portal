import Link from 'next/link'
import { ROUTES, RouteProps } from '@/config/routes'
import { Footer as FooterWrapper } from '../../components/Footer'

interface FooterLinkListProps { title: string, links: RouteProps[] }

const FooterLink = ({ name, ...props }: RouteProps) => <li>
  <Link {...props} className="text-sm text-gray-600 hover:text-green-400">
    {name}
  </Link>
</li>

const FooterLinkList = ({ title, links }: FooterLinkListProps) => <div>
  <h3 className="text-sm font-semibold mb-4">{title}</h3>
  <ul className="space-y-2">
    {links.map((link, i) => <FooterLink key={i} {...link} />)}
  </ul>
</div>

export const Footer = () => <FooterWrapper>
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">
          <Link href="/">Patient Portal</Link>
        </h2>
        <p className="text-sm text-gray-600">Manage your health with ease.</p>
      </div>
      <FooterLinkList title="Product" links={ROUTES.marketing.product} />
      <FooterLinkList title="Resources" links={ROUTES.marketing.resources} />
      <FooterLinkList title="Legal" links={ROUTES.legal} />
    </div>
  </div>
</FooterWrapper>
