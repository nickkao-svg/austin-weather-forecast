export function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

export function std(values: number[]): number | null {
  if (values.length === 0) return null;
  const avg = mean(values)!;
  const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
  const variance = mean(squaredDiffs)!;
  return Math.sqrt(variance);
}

export function quantile(values: number[], q: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (q / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  if (upper >= sorted.length) return sorted[sorted.length - 1];
  if (lower === upper) return sorted[lower];
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function min(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.min(...values);
}

export function max(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.max(...values);
}

export interface HistogramBin {
  binStart: number;
  binEnd: number;
  count: number;
}

export function histogram(values: number[], binWidth: number = 1): HistogramBin[] {
  if (values.length === 0) return [];
  
  const minVal = min(values)!;
  const maxVal = max(values)!;
  
  const startBin = Math.floor(minVal / binWidth) * binWidth;
  const endBin = Math.ceil(maxVal / binWidth) * binWidth;
  
  const bins: HistogramBin[] = [];
  
  for (let binStart = startBin; binStart < endBin; binStart += binWidth) {
    const binEnd = binStart + binWidth;
    const count = values.filter(val => val >= binStart && val < binEnd).length;
    bins.push({ binStart, binEnd, count });
  }
  
  return bins;
}
