import { Links, LiveReload, Outlet } from '@remix-run/react';

const App = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: So great, it's funny!</title>
        <Links />
      </head>
      <body>
        {/*To watch for changes in filesystem, and rebuild the site*/}
        <Outlet />
        <LiveReload /> {/*To auto-refresh browser during development*/}
      </body>
    </html>
  );
};

export default App;
