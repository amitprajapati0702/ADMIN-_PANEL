import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next';
import { ToastContainer } from "react-toastify";
import { Flip } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "./styles/custom-toast.css";
import "./tailwind.css";
import i18n from './i18n.js';
import store from './redux/store.js';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            toastStyle={{ fontSize: "14px" }}
            theme="light" />
        </I18nextProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
