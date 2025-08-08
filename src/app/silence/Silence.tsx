import { useEffect, useRef, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/useAuth';

const PRESETS = [5, 10, 20, 25];

export default function Silence() {
  const { user } = useAuth();
  const [minutes, setMinutes] = useState(10);
  const [remaining, setRemaining] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState('');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => setRemaining(minutes * 60), [minutes]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [running]);

  useEffect(() => { if (remaining === 0 && running) { setRunning(false); void saveSession(); } }, [remaining]);

  async function saveSession() {
    if (!user) return;
    await addDoc(collection(db, 'practiceSessions'), {
      userId: user.uid,
      type: 'silence',
      startedAt: Date.now() - minutes*60*1000 + (minutes*60-remaining)*1000,
      durationSec: minutes * 60,
      notes: note || null,
      createdAt: serverTimestamp(),
    });
  }

  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = Math.floor(remaining % 60).toString().padStart(2, '0');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Silence</h1>
      <p className="text-slate-600">Notice. Return. Be here. Let unknowing be a mercy.</p>

      <div className="flex gap-2">
        {PRESETS.map((m) => (
          <button key={m} onClick={() => setMinutes(m)} className={`px-3 py-2 rounded border ${m===minutes?'bg-slate-900 text-white':'bg-white'}`}>{m}m</button>
        ))}
      </div>

      <div className="text-6xl tabular-nums">{mm}:{ss}</div>

      <div className="flex gap-3">
        {!running && remaining>0 && (
          <button className="px-4 py-2 rounded bg-slate-900 text-white" onClick={()=>setRunning(true)}>Start</button>
        )}
        {running && (
          <button className="px-4 py-2 rounded border" onClick={()=>setRunning(false)}>Pause</button>
        )}
        {!running && remaining < minutes*60 && remaining>0 && (
          <button className="px-4 py-2 rounded border" onClick={()=>setRunning(true)}>Resume</button>
        )}
        {!running && remaining===0 && (
          <button className="px-4 py-2 rounded border" onClick={()=>{ setRemaining(minutes*60); setNote(''); }}>Reset</button>
        )}
      </div>

      <textarea className="w-full border rounded p-2" placeholder="Optional note (what surfaced?)" value={note} onChange={e=>setNote(e.target.value)} />
    </div>
  );
}