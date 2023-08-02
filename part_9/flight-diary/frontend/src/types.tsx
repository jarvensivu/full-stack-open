export interface RadioButtonProps {
  button: string;
  currentValue: string;
  handleSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


export interface DiaryEntry {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment?: string;
}

export type NewDiaryEntry = Omit<DiaryEntry, "id">;
