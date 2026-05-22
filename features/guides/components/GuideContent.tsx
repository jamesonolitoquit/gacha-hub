import { Fragment } from 'react';

type Props = {
  content: string | null;
};

function renderLine(line: string, index: number) {
  const trimmed = line.trim();

  if (!trimmed) {
    return <br key={index} />;
  }

  if (trimmed.startsWith('## ')) {
    return (
      <h2 key={index} className="mb-3 mt-6 text-lg font-semibold text-white first:mt-0">
        {trimmed.slice(3)}
      </h2>
    );
  }

  if (trimmed.startsWith('### ')) {
    return (
      <h3 key={index} className="mb-2 mt-4 text-base font-medium text-white/90">
        {trimmed.slice(4)}
      </h3>
    );
  }

  if (trimmed.startsWith('---')) {
    return <hr key={index} className="my-6 border-white/10" />;
  }

  if (trimmed.startsWith('- ')) {
    return (
      <li key={index} className="ml-4 list-disc text-sm leading-6 text-white/75">
        {trimmed.slice(2)}
      </li>
    );
  }

  if (trimmed.startsWith('| ')) {
    return null;
  }

  return (
    <p key={index} className="text-sm leading-7 text-white/75">
      {trimmed}
    </p>
  );
}

function renderTableBlock(lines: string[], startIndex: number) {
  const tableLines: string[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed.startsWith('|')) break;
    tableLines.push(trimmed);
  }

  if (tableLines.length < 2) return { node: null, consumed: 0 };

  const headers = tableLines[0].split('|').filter(Boolean).map((h) => h.trim());
  const separator = tableLines[1];
  const isSeparator = /^[\s|:-]+$/.test(separator);

  const dataRows = isSeparator ? tableLines.slice(2) : tableLines.slice(1);

  return {
    node: (
      <div key={`table-${startIndex}`} className="my-4 overflow-x-auto">
        <table className="w-full min-w-[300px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-2 text-left text-[0.6rem] uppercase tracking-[0.15em] text-white/50 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri} className="border-b border-white/5 last:border-0">
                {row.split('|').filter(Boolean).map((cell, ci) => (
                  <td key={ci} className="px-3 py-1.5 text-white/75">
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    consumed: tableLines.length,
  };
}

export default function GuideContent({ content }: Props) {
  if (!content) {
    return <p className="text-sm text-white/50">No content available.</p>;
  }

  const rawLines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const trimmed = rawLines[i].trim();

    if (trimmed.startsWith('| ')) {
      const result = renderTableBlock(rawLines, i);
      if (result.node) {
        nodes.push(result.node);
        i += result.consumed;
        continue;
      }
    }

    nodes.push(<Fragment key={i}>{renderLine(rawLines[i], i)}</Fragment>);
    i++;
  }

  return <div className="space-y-0">{nodes}</div>;
}
