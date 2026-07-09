import React, { useState, useEffect } from 'react';
import surveyData from './data/tasks.json';

function App() {
  // --- STATE MANAGEMENT ---
  const [lang, setLang] = useState('zh'); // Default to Chinese for Mainland China
  const [assignedBlock, setAssignedBlock] = useState(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [surveyStage, setSurveyStage] = useState('welcome'); // welcome, experiment, completed
  const [responses, setResponses] = useState([]);
  const [taskStartTime, setTaskStartTime] = useState(null);

  // --- 1. RANDOM BLOCK SELECTION ---
  useEffect(() => {
    if (surveyStage === 'experiment' && assignedBlock === null) {
      const totalBlocks = surveyData.blocks.length;
      const randomBlockIndex = Math.floor(Math.random() * totalBlocks);
      setAssignedBlock(surveyData.blocks[randomBlockIndex]);
      setTaskStartTime(Date.now()); // Start timer for the first task
    }
  }, [surveyStage]);

  // --- 2. HANDLING USER CHOICE ---
  const handleChoice = (optionId) => {
    const endTime = Date.now();
    const reactionTimeMs = endTime - taskStartTime;
    const currentTask = assignedBlock.tasks[currentTaskIndex];

    // Log the structural metric data for future regression modeling (e.g., Mixl / clogit)
    const currentResponse = {
      blockId: assignedBlock.blockId,
      taskId: currentTask.taskId,
      selectedOption: optionId,
      reactionTimeSeconds: (reactionTimeMs / 1000).toFixed(2),
      timestamp: new Date().toISOString()
    };

    const updatedResponses = [...responses, currentResponse];
    setResponses(updatedResponses);

    // Progress to the next task or finish
    if (currentTaskIndex + 1 < assignedBlock.tasks.length) {
      setCurrentTaskIndex(prev => prev + 1);
      setTaskStartTime(Date.now()); // Reset timer for next question
    } else {
      setSurveyStage('completed');
      submitDataToServer(updatedResponses);
    }
  };

  // --- 3. BACKEND TRANSMISSION PLACEHOLDER ---
  const submitDataToServer = (finalResponses) => {
    console.log("Final Payload Collected for Export:", finalResponses);
    // In our next phase, we will hook this payload up to your server endpoint
    alert(lang === 'zh' ? "数据提交成功！谢谢您的参与。" : "Data submitted successfully! Thank you.");
  };

  if (surveyStage === 'welcome') {
    return (
      <div style={styles.container}>
        <button onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')} style={styles.langBtn}>
          {lang === 'zh' ? 'English' : '中文'}
        </button>
        <h1 style={styles.title}>{surveyData.experimentTitle}</h1>
        <p style={styles.body}>
          {lang === 'zh' 
            ? "欢迎参加这项关于生育政策决策的研究。本项实验将展示不同的政策组合组合形式。请根据您的真实意愿进行最优选择。" 
            : "Welcome to this research study on fertility policy decisions. You will be presented with alternative policy frameworks. Please select the option that best reflects your true preference."}
        </p>
        <button onClick={() => setSurveyStage('experiment')} style={styles.mainBtn}>
          {lang === 'zh' ? "开始实验" : "Start Experiment"}
        </button>
      </div>
    );
  }

  if (surveyStage === 'experiment' && assignedBlock) {
    const currentTask = assignedBlock.tasks[currentTaskIndex];
    const labels = surveyData.attributeLabels;

    return (
      <div style={styles.container}>
        <div style={styles.progress}>
          {lang === 'zh' 
            ? `进度: 任务 ${currentTaskIndex + 1} / ${assignedBlock.tasks.length} (区组 ID: ${assignedBlock.blockId})` 
            : `Progress: Task ${currentTaskIndex + 1} of ${assignedBlock.tasks.length} (Block ID: ${assignedBlock.blockId})`}
        </div>

        {/* --- COMPARISON TABLE --- */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>{lang === 'zh' ? "政策属性" : "Policy Attribute"}</th>
              <th style={styles.th}>{lang === 'zh' ? "方案 A" : "Policy A"}</th>
              <th style={styles.th}>{lang === 'zh' ? "方案 B" : "Policy B"}</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(labels).map((key) => (
              <tr key={key}>
                <td style={styles.tdKey}><strong>{labels[key][lang]}</strong></td>
                <td style={styles.tdVal}>{currentTask.policyA[key][lang]}</td>
                <td style={styles.tdVal}>{currentTask.policyB[key][lang]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- CHOICE BUTTONS --- */}
        <div style={styles.btnGroup}>
          <button onClick={() => handleChoice('A')} style={styles.choiceBtn}>
            {lang === 'zh' ? "选择 方案 A" : "Select Policy A"}
          </button>
          <button onClick={() => handleChoice('B')} style={styles.choiceBtn}>
            {lang === 'zh' ? "选择 方案 B" : "Select Policy B"}
          </button>
          <button onClick={() => handleChoice('C')} style={styles.optOutBtn}>
            {currentTask.optionC[lang]}
          </button>
        </div>
      </div>
    );
  }

  if (surveyStage === 'completed') {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>{lang === 'zh' ? "实验已结束" : "Experiment Completed"}</h2>
        <p style={styles.body}>
          {lang === 'zh' ? "感谢您的宝贵时间。您的回答已被安全保存。" : "Thank you for your time. Your answers have been securely recorded."}
        </p>
      </div>
    );
  }
}

// --- MINIMAL DESIGN STYLES ---
const styles = {
  container: { maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: '-apple-system, sans-serif', color: '#333' },
  langBtn: { float: 'right', padding: '6px 12px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' },
  title: { fontSize: '24px', marginBottom: '20px', marginTop: '20px' },
  body: { fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' },
  mainBtn: { background: '#0070f3', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' },
  progress: { fontSize: '14px', color: '#666', marginBottom: '10px', textAlign: 'right' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  th: { background: '#f5f5f7', padding: '12px', border: '1px solid #e1e1e4', textAlign: 'left', fontWeight: '6px' },
  tdKey: { padding: '12px', border: '1px solid #e1e1e4', background: '#fafafa', width: '30%' },
  tdVal: { padding: '12px', border: '1px solid #e1e1e4', width: '35%' },
  btnGroup: { display: 'flex', flexDirection: 'column', gap: '12px' },
  choiceBtn: { background: '#28a745', color: 'white', padding: '14px', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
  optOutBtn: { background: '#6c757d', color: 'white', padding: '14px', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }
};

export default App;