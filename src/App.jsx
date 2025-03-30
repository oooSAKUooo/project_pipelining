import React, { useState } from "react";
import FileUploader from "./components/FileUploader";
import InstructionTable from "./components/InstructionTable";
import PipelineTimeline from "./components/PipelineTimeline";
import CPIChart from "./components/CPIChart";
import { parseInstructions } from "./utils/parser";
import { analyzePipeline } from "./utils/analyzer";

function App() {
  const [instructions, setInstructions] = useState([]);
  const [timelineNoForward, setTimelineNoForward] = useState([]);
  const [timelineWithForward, setTimelineWithForward] = useState([]);
  const [cpiData, setCpiData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleFileParsed = (lines) => {
    const parsed = parseInstructions(lines);

    const timelineNoFwd = analyzePipeline(parsed, false);
    const timelineFwd = analyzePipeline(parsed, true);

    const totalCyclesNoFwd = timelineNoFwd.at(-1)?.stages.WB || 0;
    const totalCyclesFwd = timelineFwd.at(-1)?.stages.WB || 0;

    const cpiNoFwd = totalCyclesNoFwd / parsed.length;
    const cpiFwd = totalCyclesFwd / parsed.length;

    // สำหรับ non-pipelined แต่ละคำสั่งใช้ 5 รอบ ดังนั้น ideal CPI = 5
    const idealCPI = 5;

    setInstructions(parsed);
    setTimelineNoForward(timelineNoFwd);
    setTimelineWithForward(timelineFwd);
    setCpiData([
      { mode: "No Forwarding", cpi: parseFloat(cpiNoFwd.toFixed(2)) },
      { mode: "With Forwarding", cpi: parseFloat(cpiFwd.toFixed(2)) },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8 relative">
        <h1 className="text-4xl font-bold text-center text-indigo-700">
          Pipeline Analyzer
        </h1>

        {/* ปุ่ม ℹ️ ในกรอบมุมซ้าย */}
        <button
          onClick={() => setShowModal(true)} // เปิด Modal เมื่อกด
          className="absolute top-4 right-4  p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300"
        >
          ℹ️
        </button>

        {/* Modal แสดงคำอธิบาย */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-lg w-full z-50">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
                 Pipelining Stages Explanation
              </h2>
              <p><strong>IF (Instruction Fetch):</strong> ดึงคำสั่งจาก memory</p>
              <p><strong>ID (Instruction Decode):</strong> แปลคำสั่งและเตรียม operands</p>
              <p><strong>EX (Execute):</strong> คำนวณหรือทำงานตามคำสั่ง (เช่น ALU operation)</p>
              <p><strong>MEM (Memory Access):</strong> อ่านหรือเขียนข้อมูลใน memory</p>
              <p><strong>WB (Write Back):</strong> เขียนค่าผลลัพธ์กลับ register</p>

              <button
                onClick={() => setShowModal(false)} // ปิด Modal
                className="mt-4 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}



        <FileUploader onFileParsed={handleFileParsed} />

        {instructions.length > 0 && (
          <>
            <InstructionTable instructions={instructions} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-center font-semibold text-indigo-600 mb-2"> No Forwarding</h3>
                <PipelineTimeline timeline={timelineNoForward} />
              </div>
              <div>
                <h3 className="text-center font-semibold text-indigo-600 mb-2"> With Forwarding</h3>
                <PipelineTimeline timeline={timelineWithForward} />
              </div>
            </div>

            <CPIChart data={cpiData} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
