import { Icon } from '@chakra-ui/react';
import { MdDashboard, MdHome, MdLock, MdOutlineShoppingCart } from 'react-icons/md';

// Admin Imports
import DashboardsDefault from 'views/admin/dashboards/default';
import DashboardsRTLDefault from 'views/admin/dashboards/rtl';
import DashboardsCarInterface from 'views/admin/dashboards/carInterface';
import DashboardsSmartHome from 'views/admin/dashboards/smartHome';

// // NFT Imports
import NFTMarketplace from 'views/admin/nfts/marketplace';
import NFTPage from 'views/admin/nfts/page';
import NFTCollection from 'views/admin/nfts/collection';
import NFTProfile from 'views/admin/nfts/profile';

// Main Imports
import AccountBilling from 'views/admin/main/account/billing';
import AccountApplications from 'views/admin/main/account/application';
import AccountInvoice from 'views/admin/main/account/invoice';
import AccountSettings from 'views/admin/main/account/settings';
import AccountAllCourses from 'views/admin/main/account/courses';
import AccountCoursePage from 'views/admin/main/account/coursePage';

import UserNew from 'views/admin/main/users/newUser';
import UsersOverview from 'views/admin/main/users/overview';
import UsersReports from 'views/admin/main/users/reports';

import ProfileSettings from 'views/admin/main/profile/settings';
import ProfileOverview from 'views/admin/main/profile/overview';
import ProfileNewsfeed from 'views/admin/main/profile/newsfeed';

import ApplicationsKanban from 'views/admin/main/applications/kanban';
import ApplicationsDataTables from 'views/admin/main/applications/dataTables';
import ApplicationsCalendar from 'views/admin/main/applications/calendar';

import EcommerceNewProduct from 'views/admin/main/ecommerce/newProduct';
import EcommerceProductSettings from 'views/admin/main/ecommerce/settingsProduct';
import EcommerceProductPage from 'views/admin/main/ecommerce/pageProduct';
import EcommerceOrderList from 'views/admin/main/ecommerce/orderList';
import EcommerceOrderDetails from 'views/admin/main/ecommerce/orderDetails';
import EcommerceReferrals from 'views/admin/main/ecommerce/referrals';

// Others
import OthersNotifications from 'views/admin/main/others/notifications';
import OthersPricing from 'views/admin/main/others/pricing';
import OthersError from 'views/admin/main/others/404';
import Messages from 'views/admin/main/others/messages';

// Auth Imports
import ForgotPasswordCentered from 'views/auth/forgotPassword/ForgotPasswordCentered';
import ForgotPasswordDefault from 'views/auth/forgotPassword/ForgotPasswordDefault';
import LockCentered from 'views/auth/lock/LockCentered';
import LockDefault from 'views/auth/lock/LockDefault';
import SignInCentered from 'views/auth/signIn/SignInCentered';
import SignInDefault from 'views/auth/signIn/SignInDefault';
import SignUpCentered from 'views/auth/signUp/SignUpCentered';
import SignUpDefault from 'views/auth/signUp/SignUpDefault';
import VerificationCentered from 'views/auth/verification/VerificationCentered';
import VerificationDefault from 'views/auth/verification/VerificationDefault';
import TopCoins from 'views/admin/dashboards/topCoins';
import CoinPage from 'views/admin/coinPage';
import VerifyEmail from 'views/auth/verifyEmail/VerifyEmailDefault';
import UpdatePassword from 'views/auth/updatePassword/UpdatePasswordDefault';
import BalancesPage from 'views/admin/portfolio/balances';
import PortfolioOverview from 'views/admin/portfolio/overview';
import TransactionsPage from 'views/admin/portfolio/transactions';
import { BsBarChart } from 'react-icons/bs';
import MyAlertsPage from 'views/admin/alerts/myAlerts';
import CreateAlertPage from 'views/admin/alerts/create';
import { BiBell } from 'react-icons/bi';
import { TbChartCandle } from 'react-icons/tb';
import CreateStrategyPage from 'views/admin/strategies/create';
import MyStrategiesPage from 'views/admin/strategies/myStartegies';
import StrategyMarketplace from 'views/admin/strategies/marketplace';
import BundlesPage from 'views/admin/portfolio/bundles';
import NftsPage from 'views/admin/portfolio/nfts';
import TopNfts from 'views/admin/dashboards/topNfts';

const routes = [
	// --- Dashboards ---
	{
		name: 'Dashboards',
		path: '/dashboards',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		collapse: true,
		items: [
			{
				name: 'Top Coins',
				layout: '/admin',
				path: '/dashboards/default',
				component: TopCoins
			},
			{
				name: 'Top NFTs',
				layout: '/admin',
				path: '/dashboards/nfts',
				component: TopNfts
			},
			{
				name: 'Overview',
				layout: '/admin',
				path: '/dashboards/overview',
				component: CoinPage
			},
		]
	},
	// --- Portfolio ---
	{
		name: 'Portfolio',
		path: '/portfolio',
		icon: <Icon as={BsBarChart} width='20px' height='20px' color='inherit' />,
		collapse: true,
		items: [
			{
				name: 'Overview',
				layout: '/admin',
				path: '/portfolio/overview',
				component: PortfolioOverview
			},
			{
				name: 'Balances',
				layout: '/admin',
				path: '/portfolio/balances',
				component: BalancesPage
			},
			{
				name: 'Transactions',
				layout: '/admin',
				path: '/portfolio/transactions',
				component: TransactionsPage
			},
			/*{
				name: 'NFTs',
				layout: '/admin',
				path: '/portfolio/nfts',
				component: NftsPage
			}*/
			{
				name: 'Bundles',
				layout: '/admin',
				path: '/portfolio/bundles',
				component: BundlesPage
			}
		]
	},
	// --- Alerts ---
	{
		name: 'Alerts',
		path: '/alerts',
		icon: <Icon as={BiBell} width='20px' height='20px' color='inherit' />,
		collapse: true,
		items: [
			{
				name: 'My Alerts',
				layout: '/admin',
				path: '/alerts/my',
				component: MyAlertsPage
			},
			{
				name: 'Create',
				layout: '/admin',
				path: '/alerts/create',
				component: CreateAlertPage
			}
		]
	},
	// --- Strategies ---
	{
		name: 'Strategies',
		path: '/strategy',
		icon: <Icon as={TbChartCandle} width='20px' height='20px' color='inherit' />,
		collapse: true,
		items: [
			{
				name: 'Marketplace',
				layout: '/admin',
				path: '/strategy/marketplace',
				component: StrategyMarketplace
			},
			{
				name: 'My Strategies',
				layout: '/admin',
				path: '/strategy/my',
				component: MyStrategiesPage
			},
			{
				name: 'Create',
				layout: '/admin',
				path: '/strategy/create',
				component: CreateStrategyPage
			}
		]
	},
	// --- Authentication ---
	{
		name: 'Authentication',
		path: '/auth',
		icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
		collapse: true,
		items: [
			// --- Sign In ---
			{
				name: 'Sign In',
				path: '/sign-in',
				collapse: true,
				items: [
					{
						name: 'Default',
						layout: '/auth',
						path: '/sign-in/default',
						component: SignInDefault
					},
					{
						name: 'Centered',
						layout: '/auth',
						path: '/sign-in/centered',
						component: SignInCentered
					}
				]
			},
			// --- Sign Up ---
			{
				name: 'Sign Up',
				path: '/sign-up',
				collapse: true,
				items: [
					{
						name: 'Default',
						layout: '/auth',
						path: '/sign-up/default',
						component: SignUpDefault
					},
					{
						name: 'Centered',
						layout: '/auth',
						path: '/sign-up/centered',
						component: SignUpCentered
					}
				]
			},
			{
				name: 'Update Password',
				path: '/update-password',
				collapse: true,
				items: [
					{
						name: 'Default',
						layout: '/auth',
						path: '/update-password/default',
						component: UpdatePassword
					}
				]
			},
			{
				name: 'Verify Email',
				path: '/verify-email',
				collapse: true,
				items: [
					{
						name: 'Default',
						layout: '/auth',
						path: '/verify-email/default',
						component: VerifyEmail
					}
				]
			},
			// --- Verification ---
			{
				name: 'Verification',
				path: '/verification',
				collapse: true,
				items: [
					{
						name: 'Default',
						layout: '/auth',
						path: '/verification/default',
						component: VerificationDefault
					},
					{
						name: 'Centered',
						layout: '/auth',
						path: '/verification/centered',
						component: VerificationCentered
					}
				]
			},
			// --- Lock ---
			{
				name: 'Lock',
				path: '/lock',
				collapse: true,
				items: [
					{
						name: 'Default',
						layout: '/auth',
						path: '/lock/default',
						component: LockDefault
					},
					{
						name: 'Centered',
						layout: '/auth',
						path: '/lock/centered',
						component: LockCentered
					}
				]
			},
			// --- Forgot Password ---
			{
				name: 'Forgot Password',
				path: '/forgot-password',
				collapse: true,
				items: [
					{
						name: 'Default',
						layout: '/auth',
						path: '/forgot-password/default',
						component: ForgotPasswordDefault
					},
					{
						name: 'Centered',
						layout: '/auth',
						path: '/forgot-password/centered',
						component: ForgotPasswordCentered
					}
				]
			}
		]
	}
];

export default routes;
