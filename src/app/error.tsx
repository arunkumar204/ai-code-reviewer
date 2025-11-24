"use client";

export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body className="p-6">
        <h1 className="text-red-600 text-2xl font-bold">Something went wrong</h1>
        <p>{error.message}</p>
      </body>
    </html>
  );
}
