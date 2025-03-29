import React from "react";

function PipelineTimeline({ timeline }) {
  const stages = ["IF", "ID", "EX", "MEM", "WB"];

  const getCell = (cycle, stageMap) => {
    for (let stage of stages) {
      if (stageMap[stage] === cycle) return stage;
    }
    return "";
  };

  const maxCycle = Math.max(...timeline.map(t => t.stages.WB));

  return (
    <div>
      <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600"> Pipeline Timeline</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-center text-sm border-gray-300">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="border px-2 py-1">Instr#</th>
              {[...Array(maxCycle)].map((_, i) => (
                <th key={i} className="border px-2">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeline.map((entry, i) => {
              const stageCycles = Object.values(entry.stages);
              const stageCycleSet = new Set(stageCycles);
              const stallSet = new Set();

              const first = entry.stages.IF;
              const last = entry.stages.WB;

              for (let c = first; c <= last; c++) {
                if (!stageCycleSet.has(c)) stallSet.add(c); // 🔥 ช่องที่ไม่ใช่ stage → คือ stall
              }

              return (
                <tr key={i} className="even:bg-gray-50">
                  <td className="border px-2 py-1">{i + 1}</td>
                  {[...Array(maxCycle)].map((_, cycle) => {
                    const current = cycle + 1;
                    const stageLabel = getCell(current, entry.stages);

                    const isStall = current >= entry.stages.IF - entry.stall && current < entry.stages.IF;
                    const isBeforeStart = current < entry.stages.IF - entry.stall;

                    return (
                      <td
                        key={cycle}
                        className={`border px-2 py-1 text-sm ${stageLabel
                            ? "bg-green-100 font-semibold"
                            : isStall
                              ? "bg-red-200 text-red-600 italic"
                              : isBeforeStart
                                ? "bg-gray-100"
                                : ""
                          }`}
                      >
                        {stageLabel || (isStall ? "Stall" : "")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 text-sm text-gray-600 flex justify-center gap-6">
        <div><span className="inline-block w-4 h-4 bg-green-100 border mr-2" />Stage</div>
        <div><span className="inline-block w-4 h-4 bg-red-200 border mr-2" />Stall</div>
      </div>
    </div>
  );
}

export default PipelineTimeline;
