import externalApiConfig from 'etc/external-api';

import SITE_CONTENT from 'content/site/en-us.json';

export default function renderHTML(html, initialState, config, shareContent, env) {
  const isProduction = (env === 'production');
  const robotsMeta = isProduction ? 'index,follow' : 'noindex,nofollow';
  const gaSrcUrl = isProduction ? 'https://www.google-analytics.com/analytics.js' : 'https://www.google-analytics.com/analytics_debug.js';
  const vendorScript = isProduction ? `<script type="text/javascript" src="${config.staticUrl}/static/build/vendor.bundle.js"></script>` : '';

  return `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta name="description" content="${SITE_CONTENT.SHARE.DEFAULT_DESCRIPTION}">
      <meta name="robots" content="${robotsMeta}">
      <meta property="fb:app_id" content="${externalApiConfig.facebook.id}">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="${SITE_CONTENT.SITE_NAME}">
      <meta property="og:image" content="${shareContent.image}">
      <meta property="og:image:width" content="${shareContent.imageWidth}">
      <meta property="og:image:height" content="${shareContent.imageHeight}">
      <meta property="og:title" content="${shareContent.title}">
      <meta property="og:description" content="${shareContent.description}">
      <meta property="og:url" content="${shareContent.url}">
      <title>${SITE_CONTENT.SITE_NAME}</title>
      <link rel="shortcut icon" type="image/png" href="/static/images/favicon.png">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
      <link rel="stylesheet" href="${config.staticUrl}/static/build/app.css">
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script',"${gaSrcUrl}",'ga');
      </script>
      <script>
        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
      </script>
    </head>
    <body>
      <div id="app">${html}</div>

      <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}</script>
      <script>__REACT_DEVTOOLS_GLOBAL_HOOK__ = parent.__REACT_DEVTOOLS_GLOBAL_HOOK__</script>
      ${vendorScript}
      <script type="text/javascript" src="${config.staticUrl}/static/build/app.js"></script>
    </body>
    </html>
  `;
}
