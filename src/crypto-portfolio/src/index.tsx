import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import { UserProvider } from 'contexts/UserContext';
import { CoinsProvider } from 'contexts/CoinsContext';
import { PortfolioProvider } from 'contexts/PortfolioContext';
import { AlertsProvider } from 'contexts/AlertsContext';

ReactDOM.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<UserProvider>
				<CoinsProvider>
					<PortfolioProvider>
						<AlertsProvider>
							<HashRouter>
								<Switch>
									<Route path={`/auth`} component={AuthLayout} />
									<Route path={`/admin`} component={AdminLayout} />
									<Route path={`/rtl`} component={RTLLayout} />
									<Redirect from='/' to='/admin' />
								</Switch>
							</HashRouter>
						</AlertsProvider>
					</PortfolioProvider>
				</CoinsProvider>
			</UserProvider>
		</React.StrictMode>
	</ChakraProvider>,
	document.getElementById('root')
);
