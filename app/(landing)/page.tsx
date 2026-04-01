export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to VentureScope</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Your journey to finding the perfect venture starts here.
      </p>
      <div className="flex gap-4">
        <a
          href="/sign-in"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Sign In
        </a>
        <a
          href="/register"
          className="px-4 py-2 border rounded-md hover:bg-muted"
        >
          Register
        </a>
      </div>
    </div>
  );
}
