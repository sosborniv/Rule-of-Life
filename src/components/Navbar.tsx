import { Link, NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white border-b">
      <Link to="/" className="font-semibold">Rule of Life</Link>
      <div className="flex gap-4 text-sm">
        <NavLink to="/silence">Silence</NavLink>
        <NavLink to="/examen">Examen</NavLink>
        <NavLink to="/lectio">Lectio</NavLink>
        <NavLink to="/breath">Breath</NavLink>
        <NavLink to="/rule">Rule</NavLink>
        <NavLink to="/journal">Journal</NavLink>
        <NavLink to="/settings">Settings</NavLink>
        <button onClick={() => signOut(auth)}>Sign out</button>
      </div>
    </nav>
  );
}