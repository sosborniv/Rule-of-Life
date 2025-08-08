import { useEffect, useState } from 'react';
import sample from '../../lib/scripture/sample-asv.json';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/useAuth';

const STEPS = ['Silencio','Lectio','Meditatio','Oratio','Contemplatio'] as const;

type Step = typeof STEPS[number];

export default function Lectio() {
  const { user } = useAuth();
  const [ref, setRef] = useState('John 1:1-5');
  const [text, setText] = useState<string[]>([]);
  const [step, setStep] = useState<Step>('Silencio');
  const [word, setWord] = useState('');
  const [prayer, setPrayer] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const passage = (sample as any)[ref];
    setText(passage || []);
  }, [ref]);

  async function save() {
    if (!user) return;
    await addDoc(collection(db, 'lectioSessions'), {
      userId: user.uid,
      passageRef: `${ref} (ASV)`,
      wordOrPhrase: word || null,
      prayer: prayer || null,
      contemplationNote: note || null,
      createdAt: serverTimestamp(),
    });
    setWord(''); setPrayer(''); setNote('');
    alert('Saved. Listen for the word given, not the insight achieved.');
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Lectio Divina</h1>
      <input className="border rounded px-3 py-2" value={ref} onChange={e=>setRef(e.target.value)} />
      <div className="p-3 bg-white border rounded">
        {text.length ? text.map((v,i)=>(<p key={i} className="mb-2">{v}</p>)) : <em>Type a supported reference (sample includes John 1:1-5)</em>}
      </div>

      <div className="flex gap-2">
        {STEPS.map(s => (
          <button key={s} className={`px-3 py-1 rounded border ${s===step?'bg-slate-900 text-white':''}`} onClick={()=>setStep(s)}>{s}</button>
        ))}
      </div>

      {step==='Lectio' && (
        <input className="w-full border rounded p-2" placeholder="Word/phrase given" value={word} onChange={e=>setWord(e.target.value)} />
      )}
      {step==='Meditatio' && (
        <textarea className="w-full border rounded p-2" placeholder="What stirs?" value={note} onChange={e=>setNote(e.target.value)} />
      )}
      {step==='Oratio' && (
        <textarea className="w-full border rounded p-2" placeholder="Pray in response" value={prayer} onChange={e=>setPrayer(e.target.value)} />
      )}

      <button className="px-4 py-2 rounded bg-slate-900 text-white" onClick={save}>Save</button>
    </div>
  );
}