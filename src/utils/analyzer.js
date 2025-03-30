// utils/analyzer.js

export function analyzePipeline(instructions, useForwarding = true) {
  const timeline = [];
  const registerWriteCycle = {};
  let cycle = 1; // เริ่มนับ cycle ตั้งแต่ 1

  for (let i = 0; i < instructions.length; i++) {
    const instr = instructions[i];
    const [rd, rs1, rs2] = instr.operands;
    let stall = 0;

    if (useForwarding) {
      // ตรวจสอบ hazard สำหรับ load-use hazard
      if (i > 0) {
        const prevInstr = instructions[i - 1];
        if (prevInstr.opcode === "lw") {
          const prevRd = prevInstr.operands[0];
          if ((rs1 && rs1 === prevRd) || (rs2 && rs2 === prevRd)) {
            stall = 1; // เพิ่ม stall 1 รอบ
          }
        }
      }
    } else {
      // แบบไม่มี forwarding ต้องรอให้ผลลัพธ์เขียนกลับก่อน
      if (rs1 && registerWriteCycle[rs1] && registerWriteCycle[rs1] >= cycle + 1) {
        stall = Math.max(stall, registerWriteCycle[rs1] - cycle);
      }
      if (rs2 && registerWriteCycle[rs2] && registerWriteCycle[rs2] >= cycle + 1) {
        stall = Math.max(stall, registerWriteCycle[rs2] - cycle);
      }
    }

    // กำหนดจังหวะของ pipeline โดย IF stage เริ่มที่ cycle หลัง stall
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
    });

    if (rd) {
      registerWriteCycle[rd] = stagesMap.WB;
    }
    // รอบต่อไปจะเริ่ม IF หลังจากรอบปัจจุบัน
    cycle = start + 1;
  }

  return timeline;
}
