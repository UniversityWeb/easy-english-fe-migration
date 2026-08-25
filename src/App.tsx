import { Fragment, Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { publicRoutes } from '~/routes';
import DefaultLayout from '~/layouts/DefaultLayout';
import { ChakraProvider } from '@chakra-ui/react';
import customTheme from '~/themes/customTheme';
import NotFound from '~/components/NotFound';
import config from '~/config';
import LoaderPage from '~/components/LoaderPage';
import WebSocketService from '~/services/websocketService';
import { Provider } from 'react-redux';
import store from './store/store';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    let webSocketInstance;

    // Connect to WebSocket on component mount
    const initWebSocket = async () => {
      try {
        webSocketInstance = await WebSocketService.getIns();
        console.log('WebSocket connected');
      } catch (error) {
        console.error('WebSocket connection failed:', error);
      }
    };

    initWebSocket();
    return () => {
      if (webSocketInstance) {
        webSocketInstance.disconnect();
        console.log('WebSocket disconnected');
      }
    };
  }, []);

  return (
    <Router>
      <Provider store={store}>
        <ChakraProvider theme={customTheme}>
          <div className="App">
            <Suspense fallback={<LoaderPage />}>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to={config.routes.login} replace />}
                />

                {publicRoutes.map((route, index) => {
                  const Page = route.component;
                  const allowedRoles = route.roles || ['ALL'];
                  let Layout = DefaultLayout;

                  if (route.layout) {
                    Layout = route.layout;
                  } else if (route.layout === null) {
                    Layout = Fragment;
                  }

                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        <ProtectedRoute allowedRoles={allowedRoles}>
                          <Layout>
                            <Page />
                          </Layout>
                        </ProtectedRoute>
                      }
                    />
                  );
                })}

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </ChakraProvider>
      </Provider>
    </Router>
  );
}

export default App;
