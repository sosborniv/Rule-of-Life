import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/useAuth';

export default function Breath() {
  const { user } = useAuth();
  const [title, setTitle] = useState('Jesus Prayer');
  const [name, setName] = useState('Lord Jesus Christ');
  const [desire, setDesire] = useState('have mercy on me');
  const [pinned, setPinned] = useState(true);

  async function save() {
    if (!user) return;
    await addDoc(collection(db, 'breathPrayers'), {
      userId: user.uid,
      title, nameOfGod: name, desirePhrase: desire,
      pinnedToSilence: pinned,
      createdAt: serverTimestamp(),
    });
    alert('Saved. Name God; voice your desire; breathe.');
  }

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Breath Prayer</h1>
      <input className="w-full border rounded p-2" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
      <input className="w-full border rounded p-2" value={name} onChange={e=>setName(e.target.value)} placeholder="Name of God" />
      <input className="w-full border rounded p-2" value={desire} onChange={e=>setDesire(e.target.value)} placeholder="Desire phrase" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={pinned} onChange={e=>setPinned(e.target.checked)} /> Pin to Silence</label>
      <button onClick={save} className="px-4 py-2 rounded bg-slate-900 text-white">Save</button>
    </div>
  );
}