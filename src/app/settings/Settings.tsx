export default function Settings() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="p-3 bg-white border rounded">
        <h2 className="font-medium mb-2">Support the work</h2>
        <p className="text-sm text-slate-600 mb-3">
          This app is free so that anyone can practice a simple rule of life.
          If it serves you, consider a gift to keep development sustainable for others.
        </p>
        <a className="inline-block px-4 py-2 rounded bg-slate-900 text-white" href="#" onClick={(e)=>{e.preventDefault(); alert('Connect Stripe Checkout URL here.');}}>Donate</a>
      </div>
    </div>
  );
}
