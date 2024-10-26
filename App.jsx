import React from 'react';
import {Provider} from 'react-redux';
import {QueryClient} from '@tanstack/react-query';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import {DefaultTheme, PaperProvider} from 'react-native-paper';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00ffff',
    background: '#000000',
    text: '#ffffff',
  },
};

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{persister: asyncStoragePersister}}>
          <AppNavigator />
        </PersistQueryClientProvider>
      </PaperProvider>
    </Provider>
  );
};

export default App;
