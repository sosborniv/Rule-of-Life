import { useState } from 'react';
import { auth, googleProvider, appleProvider } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault(); setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      try { await createUserWithEmailAndPassword(auth, email, password); }
      catch (err: any) { setError(err?.message || 'Unable to sign in'); }
    }
  }

  async function handleGoogle() { await signInWithPopup(auth, googleProvider); }
  async function handleApple() { await signInWithPopup(auth, appleProvider); }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded-2xl shadow">
      <h1 className="text-xl font-semibold mb-4">Welcome</h1>
      <p className="text-sm text-slate-600 mb-6">Sign in to begin practicing a simple rule of life. Notice. Return. Be here.</p>

      <form onSubmit={handleEmailSignIn} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-slate-900 text-white rounded px-3 py-2">Sign in / Create account</button>
      </form>

      <div className="my-4 text-center text-sm text-slate-500">or</div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={handleGoogle} className="border rounded px-3 py-2">Google</button>
        <button onClick={handleApple} className="border rounded px-3 py-2">Apple</button>
      </div>

      {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
    </div>
  );
}