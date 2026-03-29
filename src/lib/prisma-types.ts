// Types for Prisma JSON fields in RecipeFork model.
// These match the Sanity recipe types but are used for Prisma JSON columns.

export interface ForkGrain {
  name: string;
  amount: number;
  unit: "kg" | "g";
}

export interface ForkHop {
  name: string;
  amount: number;
  time: number;
  alphaAcid: number;
}

export interface ForkYeast {
  name?: string;
  amount?: string;
  type?: string;
}

export interface ForkAddition {
  name: string;
  amount: string;
  time: number;
}

export interface ForkProcessStep {
  step: string;
  description: string;
  temp: number;
  duration: number;
}
