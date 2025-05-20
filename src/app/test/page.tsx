export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Test Page Works!</h1>
      <p className="mt-4">This means routing is functioning properly.</p>
      <a href="/" className="mt-8 text-blue-500 hover:underline">
        Go back to the Weather Dashboard
      </a>
    </div>
  );
}
