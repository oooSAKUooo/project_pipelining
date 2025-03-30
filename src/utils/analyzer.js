// utils/analyzer.js
export function analyzePipeline(instructions, useForwarding = true) {
  const timeline = [];
  const registerWriteCycle = {};
  let cycle = 1;
  let cacheHits = 0;
  let cacheMisses = 0;

  for (let i = 0; i < instructions.length; i++) {
    const instr = instructions[i];
    const [rd, rs1, rs2] = instr.operands;
    let stall = 0;

    // Simulate cache behavior (simple model)
    const isCacheHit = Math.random() > 0.2; // 80% hit rate for simulation
    if (isCacheHit) {
      cacheHits++;
    } else {
      cacheMisses++;
      stall += 1; // Add 1 cycle stall for cache miss
    }

    if (useForwarding) {
      if (i > 0) {
        const prevInstr = instructions[i - 1];
        if (prevInstr.opcode === "lw") {
          const prevRd = prevInstr.operands[0];
          if ((rs1 && rs1 === prevRd) || (rs2 && rs2 === prevRd)) {
            stall += 1;
          }
        }
      }
    } else {
      if (rs1 && registerWriteCycle[rs1] && registerWriteCycle[rs1] >= cycle + 1) {
        stall = Math.max(stall, registerWriteCycle[rs1] - cycle);
      }
      if (rs2 && registerWriteCycle[rs2] && registerWriteCycle[rs2] >= cycle + 1) {
        stall = Math.max(stall, registerWriteCycle[rs2] - cycle);
      }
    }

    const start = cycle + stall;
    const stagesMap = {
      IF: start,
      ID: start + 1,
      EX: start + 2,
      MEM: start + 3,
      WB: start + 4,
    };

    timeline.push({
      instr,
      stages: stagesMap,
      stall,
      startCycle: start,
      cacheHit: isCacheHit,
    });

    if (rd) {
      registerWriteCycle[rd] = stagesMap.WB;
    }
    cycle = start + 1;
  }

  const totalAccesses = cacheHits + cacheMisses;
  const hitRate = totalAccesses > 0 ? (cacheHits / totalAccesses) * 100 : 0;
  const missRate = totalAccesses > 0 ? (cacheMisses / totalAccesses) * 100 : 0;

  return {
    timeline,
    cacheStats: {
      hits: cacheHits,
      misses: cacheMisses,
      hitRate: parseFloat(hitRate.toFixed(2)),
      missRate: parseFloat(missRate.toFixed(2)),
    }
  };
}