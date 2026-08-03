export function isNoneRestriction(val?: string): boolean {
  if (!val) return true;
  
  const normalized = val.trim().toLowerCase();
  
  return (
    normalized === '' ||
    normalized === 'none' ||
    normalized === 'tiada' ||
    normalized === 'n/a' ||
    normalized === '-' ||
    normalized === 'nil'
  );
}
