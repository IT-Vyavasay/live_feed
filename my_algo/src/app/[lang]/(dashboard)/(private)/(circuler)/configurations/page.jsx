// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import AccountSettings from '@views/circuler/configurations'

const AccountTab = dynamic(() => import('@views/circuler/configurations/account'))
const SecurityTab = dynamic(() => import('@views/circuler/configurations/security'))
const BillingPlansTab = dynamic(() => import('@views/circuler/configurations/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/circuler/configurations/notifications'))
const ConnectionsTab = dynamic(() => import('@views/circuler/configurations/connections'))

// Vars
const tabContentList = () => ({
  account: <AccountTab />,
  security: <SecurityTab />,
  payment: <BillingPlansTab />,
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

const ConfigurationPage = () => {
  return <AccountSettings tabContentList={tabContentList()} />
}

export default ConfigurationPage
