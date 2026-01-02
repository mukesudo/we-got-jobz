'use client';

import React from 'react';

export default function GlobalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div>
          <h2>Oops! Page not found - 404</h2>
          <button onClick={props.reset}>Try again</button>
        </div>
      </body>
    </html>
  );
}
