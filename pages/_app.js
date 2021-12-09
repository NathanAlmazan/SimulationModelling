import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import ThemeConfig from '../theme';  
import createCache from '@emotion/cache';
import BaseLayout from '../layouts/BaseLayout';

function createEmotionCache() {
  return createCache({ key: 'css' });
}

const clientSideEmotionCache = createEmotionCache();

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

function MyApp({ Component,  emotionCache = clientSideEmotionCache, pageProps }) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Baylor Supreme Trading Inc.</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeConfig>
        <BaseLayout>
          <Component {...pageProps} />
        </BaseLayout>
      </ThemeConfig>
     
    </CacheProvider>
  )
}

export default MyApp
