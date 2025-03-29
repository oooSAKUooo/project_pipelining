import React from "react";

function InstructionTable({ instructions }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-indigo-600"> Instructions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Opcode</th>
              <th className="border px-4 py-2">Operands</th>
            </tr>
          </thead>
          <tbody>
            {instructions.map((instr, idx) => (
              <tr key={idx} className="text-center even:bg-gray-50">
                <td className="border px-4 py-1">{idx + 1}</td>
                <td className="border px-4 py-1">{instr.opcode}</td>
                <td className="border px-4 py-1">{instr.operands.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InstructionTable;