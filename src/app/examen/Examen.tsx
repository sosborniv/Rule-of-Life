import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/useAuth';

const DEFAULT_PROMPTS = [
  { id: 'gratitude', q: 'Give thanks for gifts received today.' },
  { id: 'review', q: 'Review the day with God. What stands out?' },
  { id: 'consolation', q: 'Where did you sense consolation (movement toward God)?' },
  { id: 'desolation', q: 'Where did you sense desolation (movement away from God)?' },
  { id: 'grace', q: 'Ask for grace for tomorrow.' },
];

export default function Examen() {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [saving, setSaving] = useState(false);

  function set(id: string, v: string) { setAnswers(a=>({ ...a, [id]: v })); }

  async function save() {
    if (!user) return;
    setSaving(true);
    await addDoc(collection(db, 'examenEntries'), {
      userId: user.uid,
      date: new Date().toISOString().slice(0,10),
      answers: DEFAULT_PROMPTS.map(p => ({ promptId: p.id, text: answers[p.id] || '' })),
      consolation: answers['consolation'] || null,
      desolation: answers['desolation'] || null,
      createdAt: serverTimestamp(),
    });
    setSaving(false);
    setAnswers({});
    alert('Saved. Attend to the day God actually gave you.');
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Daily Examen</h1>
      {DEFAULT_PROMPTS.map(p => (
        <div key={p.id}>
          <label className="block text-sm text-slate-600 mb-1">{p.q}</label>
          <textarea className="w-full border rounded p-2" value={answers[p.id]||''} onChange={e=>set(p.id,e.target.value)} />
        </div>
      ))}
      <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-slate-900 text-white">{saving?'Saving…':'Save'}</button>
    </div>
  );
}