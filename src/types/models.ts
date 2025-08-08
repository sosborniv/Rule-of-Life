export type PracticeType = 'silence'|'examen'|'lectio'|'breath';

export interface PracticeSession {
  userId: string;
  type: PracticeType;
  startedAt: number;     // epoch ms
  durationSec?: number;
  tags?: string[];       // e.g., ['body','thought','emotion']
  notes?: string;
}

export interface ExamenEntry {
  userId: string;
  date: string;          // YYYY-MM-DD (local)
  answers: { promptId: string; text: string }[];
  consolation?: string;
  desolation?: string;
}

export interface LectioSession {
  userId: string;
  passageRef: string;    // e.g., 'John 1:1–5 (ASV)'
  wordOrPhrase?: string;
  prayer?: string;
  contemplationNote?: string;
  createdAt: number;
}

export interface BreathPrayer {
  userId: string;
  title: string;         // e.g., 'Jesus Prayer'
  nameOfGod: string;     // 'Lord Jesus Christ'
  desirePhrase: string;  // 'have mercy on me'
  pinnedToSilence?: boolean;
  createdAt: number;
}

export interface RuleOfLife {
  userId: string;
  daily: PracticeType[];
  weekly?: PracticeType[];
  reminders?: { type: PracticeType; cron: string }[];
  createdAt: number;
  updatedAt: number;
}