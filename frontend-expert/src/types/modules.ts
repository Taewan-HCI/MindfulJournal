export interface DurationData {
  sessionEnd: number;
  duration: number;
  length: number;
}

export interface PHQData {
  phq9score: number;
  sessionEnd: number;
}

export interface ModuleData {
  frequency: Date[];
  duration: DurationData[];
  phqScore: PHQData[];
}

export interface WordCloudData {
  text: string;
  value: number;
}
