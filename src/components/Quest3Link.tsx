import { ExternalLink } from 'lucide-react';

export interface Quest3LinkProps {
  malString: string;
}

export function Quest3Link({ malString }: Quest3LinkProps) {
  if (!malString || malString === 'N/A') {
    return <span className="text-slate-400 font-mono text-xs">N/A</span>;
  }

  // Regex to extract MAL registration numbers (e.g. MAL19984123A)
  const malRegex = /(MAL\d{8}[A-Z0-9]*)/gi;
  const parts = malString.split(malRegex);

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 font-mono text-xs text-slate-300">
      {parts.map((part, idx) => {
        if (part.match(malRegex)) {
          const malNumber = part.toUpperCase();
          const questUrl = `https://quest3plus.bpfk.gov.my/pmo2/detail.php?type=product&id=${encodeURIComponent(
            malNumber
          )}`;

          return (
            <a
              key={idx}
              href={questUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Inspect ${malNumber} on Quest3+ BPFK Portal`}
              className="inline-flex items-center gap-1 font-semibold text-teal-400 hover:text-teal-300 underline decoration-teal-500/40 hover:decoration-teal-400 transition-colors bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20"
            >
              <span>{malNumber}</span>
              <ExternalLink className="w-3 h-3 text-teal-400" />
            </a>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
}
