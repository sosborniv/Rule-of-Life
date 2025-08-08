import { useEffect, useState } from 'react';
import { addDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/useAuth';
import { PracticeType } from '../../types/models';

const ALL: PracticeType[] = ['silence','examen','lectio','breath'];

export default function Rule() {
  const { user } = useAuth();
  const [daily, setDaily] = useState<PracticeType[]>(['silence','examen']);
  const [weekly, setWeekly] = useState<PracticeType[]>(['lectio']);

  useEffect(()=>{ (async()=>{
    if (!user) return;
    const snap = await getDocs(query(collection(db,'rules'), where('userId','==', user.uid)));
    if (!snap.empty) {
      const d = snap.docs[0].data() as any;
      setDaily(d.daily || []); setWeekly(d.weekly || []);
    }
  })(); }, [user]);

  async function save() {
    if (!user) return;
    await addDoc(collection(db, 'rules'), {
      userId: user.uid,
      daily, weekly,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    alert('Saved. Gentle reminders, not streaks.');
  }

  function toggle(list: PracticeType[], setList: (v: PracticeType[])=>void, v: PracticeType) {
    setList(list.includes(v) ? list.filter(x=>x!==v) : [...list, v]);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Rule of Life</h1>
      <section>
        <h2 className="font-medium mb-2">Daily</h2>
        <div className="flex gap-2 flex-wrap">
          {ALL.map(p=> (
            <button key={p} onClick={()=>toggle(daily, setDaily, p)} className={`px-3 py-2 rounded border ${daily.includes(p)?'bg-slate-900 text-white':''}`}>{p}</button>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-medium mb-2">Weekly</h2>
        <div className="flex gap-2 flex-wrap">
          {ALL.map(p=> (
            <button key={p} onClick={()=>toggle(weekly, setWeekly, p)} className={`px-3 py-2 rounded border ${weekly.includes(p)?'bg-slate-900 text-white':''}`}>{p}</button>
          ))}
        </div>
      </section>
      <button onClick={save} className="px-4 py-2 rounded bg-slate-900 text-white">Save</button>
    </div>
  );
}