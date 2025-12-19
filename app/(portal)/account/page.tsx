import { PortalLayout } from "../components/PortalLayout"
import { AccountSettings } from "./components/AccountSettings"

export default function AccountPage() {
  return (
    <PortalLayout heading="Account Settings">
      <AccountSettings />
    </PortalLayout>
  )
}
