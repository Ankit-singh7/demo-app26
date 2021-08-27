interface Entry {
  time: string;
  analysisMessage: string;
  analysisScore: number;
  // bloodHasBlood: boolean;
  id: number;
  customNote: string;
  presetNotes: string[];
  picture?: string;
  date: string;
}

export interface PoopSample {
  date: string;
  entries: Entry[];
}