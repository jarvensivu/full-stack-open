export interface HeaderProps {
  courseName: string;
}

export interface ContentProps {
  courseParts: CoursePart[];
}

export interface TotalProps {
  courseParts: CoursePart[];
}

export interface CoursePart {
  name: string;
  exerciseCount: number;
}
