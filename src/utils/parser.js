export function parseInstructions(lines) {
  return lines.map(line => {
    const parts = line.trim().split(/\s+/);
    const opcode = parts[0];
    const operandText = parts.slice(1).join(" ");
    const operands = operandText.split(',').map(s => s.trim());
    return { opcode, operands };
  });
}
