import db from "./db";

export type Training = {
  id: number;
  title: string;
  image: string;
  description: string;
};

export function getTrainings(): Training[] {
  return db.prepare("SELECT * FROM trainings").all() as Training[];
}
