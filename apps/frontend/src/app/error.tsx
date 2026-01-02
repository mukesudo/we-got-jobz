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
          <h2>Something went wrong</h2>
          <button onClick={props.reset}>Try again</button>
        </div>
      </body>
    </html>
  );
}
