export function analyzePipeline(instructions, useForwarding = true) {
  const timeline = [];
  const registerWriteCycle = {};
  let cycle = 0;

  for (let i = 0; i < instructions.length; i++) {
    const instr = instructions[i];
    const [rd, rs1, rs2] = instr.operands;
    let stall = 0;

    if (!useForwarding) {
      if (rs1 && registerWriteCycle[rs1] && registerWriteCycle[rs1] >= cycle + 1) {
        stall = Math.max(stall, registerWriteCycle[rs1] - cycle);
      }
      if (rs2 && registerWriteCycle[rs2] && registerWriteCycle[rs2] >= cycle + 1) {
        stall = Math.max(stall, registerWriteCycle[rs2] - cycle);
      }
    }

    const start = cycle + stall;
    const stagesMap = {
      IF: start + 1,
      ID: start + 2,
      EX: start + 3,
      MEM: start + 4,
      WB: start + 5,
    };

    timeline.push({
      instr,
      stages: stagesMap,
      stall,
      startCycle: stagesMap.IF,
    });

    if (rd) registerWriteCycle[rd] = stagesMap.WB;
    cycle = start + 1;
  }

  return timeline;
}
