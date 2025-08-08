import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useAuth } from '../../lib/useAuth';
import { db } from '../../lib/firebase';

export default function Journal() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(()=>{ (async()=>{
    if (!user) return;
    const colls = ['practiceSessions','examenEntries','lectioSessions','breathPrayers'];
    const all: any[] = [];
    for (const c of colls) {
      const snap = await getDocs(query(collection(db, c), where('userId','==', user.uid), orderBy('createdAt','desc')));
      snap.forEach(d=> all.push({ id: d.id, type: c, ...d.data() }));
    }
    all.sort((a,b)=> (b.createdAt?.toMillis?.()||0) - (a.createdAt?.toMillis?.()||0));
    setItems(all);
  })(); }, [user]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Journal</h1>
      <ul className="space-y-2">
        {items.map(i=> (
          <li key={i.id} className="p-3 bg-white border rounded">
            <div className="text-xs uppercase tracking-wide text-slate-500">{i.type}</div>
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(i, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}