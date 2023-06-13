export interface DurationData {
  sessionEnd: number;
  duration: number;
}

export interface LengthData {
  length: number;
  sessionEnd: number;
}

export interface ModuleData {
  frequency: Date[];
  duration: DurationData[];
  length: LengthData[];
}
