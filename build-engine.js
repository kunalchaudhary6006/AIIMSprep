import fs from 'fs';

try {
let content = fs.readFileSync('src/App.tsx', 'utf8');

const trialTestEngineCode = `
const mockTests = [
  { id: 1, title: 'NEET 2023 PYQ Mock (Trial)', questions: 40, duration: 180 },
  { id: 2, title: 'NEET 2022 PYQ Mock (Trial)', questions: 40, duration: 180 },
  { id: 3, title: 'NEET 2021 PYQ Mock (Trial)', questions: 40, duration: 180 },
  { id: 4, title: 'AIIMS 2019 PYQ Mock (Trial)', questions: 40, duration: 180 },
  { id: 5, title: 'PW Style Full Target Mock', questions: 40, duration: 180 },
];

const sampleQuestions = [
  { q: "A car starts from rest and accelerates uniformly at 2 m/s². What distance will it cover in 10 seconds?", opts: ["100m", "200m", "400m", "50m"], ans: 0 },
  { q: "Which of the following is an amphoteric oxide?", opts: ["CO2", "ZnO", "CaO", "CuO"], ans: 1 },
  { q: "Identify the incorrect statement regarding mitochondria:", opts: ["Double membrane bound", "Contains linear DNA", "Site of aerobic respiration", "Outer membrane is porous"], ans: 1 },
  { q: "The variation of stopping potential with the frequency of incident light for a given metal is a:", opts: ["Curve", "Straight line with positive slope", "Straight line with negative slope", "Parabola"], ans: 1 },
  { q: "Which of the following is responsible for transport of water and minerals from roots?", opts: ["Phloem", "Xylem", "Cortex", "Epidermis"], ans: 1 }
];

const allQuestions = Array.from({length: 40}).map((_, i) => {
  if (i < sampleQuestions.length) return { id: i+1, ...sampleQuestions[i] };
  return {
    id: i+1,
    q: \`NEET PYQ Selected Question \${i+1}: Consider the following statements from last 10 years papers and choose the correct option.\`,
    opts: ["Statement 1 is correct", "Statement 2 is correct", "Both are correct", "None of the above"],
    ans: i % 4
  };
});

const TrialTestEngine = ({ onClose }: { onClose: () => void }) => {
  const [activeTest, setActiveTest] = useState<number | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (activeTest && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [activeTest, timeLeft, submitted]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return \`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
  };

  if (submitted) {
    const score = Object.keys(answers).reduce((acc, qId) => acc + (answers[Number(qId)] === allQuestions[Number(qId)].ans ? 4 : -1), 0);
    return (
      <div className="p-10 text-center bg-white rounded-xl h-full flex flex-col justify-center items-center">
        <Award className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Test Submitted Successfully!</h2>
        <p className="text-xl text-gray-600 mb-8">Estimated NEET Score: <span className="font-bold text-blue-600 text-3xl ml-2">{score}</span> <span className="text-gray-400">/ 160</span></p>
        <button onClick={onClose} className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg">Return to Dashboard</button>
      </div>
    );
  }

  if (!activeTest) {
    return (
      <div className="p-4 sm:p-6 h-full flex flex-col">
        <h3 className="text-2xl font-extrabold text-blue-900 mb-2">Select a Practice Test</h3>
        <p className="text-gray-600 mb-6">Your 2-Day Free Trial gives you access to 5 premium mock tests based on the last 10 years' PYQs.</p>
        <div className="space-y-4 overflow-y-auto pr-2 flex-1 relative">
          {mockTests.map(t => (
            <div key={t.id} onClick={() => setActiveTest(t.id)} className="border border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-lg transition cursor-pointer bg-white group">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition">{t.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-4">
                     <span><FileJson className="inline w-4 h-4 mr-1" /> {t.questions} Questions</span>
                     <span><BookOpen className="inline w-4 h-4 mr-1" /> {t.duration} Mins</span>
                  </p>
                </div>
                <button className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-2.5 rounded-lg font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition">Start Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center bg-gray-900 text-white px-6 py-4 shrink-0 pr-16 relative">
        <h4 className="font-bold text-lg truncate flex-1">{mockTests.find(t=>t.id===activeTest)?.title}</h4>
        <div className="font-mono text-2xl font-black text-orange-400 bg-gray-800 px-4 py-1.5 rounded-lg shadow-inner">{formatTime(timeLeft)}</div>
      </div>
      
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden bg-white">
        <div className="w-full md:w-2/3 p-4 sm:p-8 overflow-y-auto border-r border-gray-100 flex flex-col relative">
          <div className="mb-6 border-b border-gray-100 pb-4 flex justify-between items-center">
            <span className="font-black text-xl text-blue-900">Question {currentQ + 1}</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Single Choice</span>
          </div>
          <p className="text-xl text-gray-800 mb-8 font-medium leading-relaxed">{allQuestions[currentQ].q}</p>
          
          <div className="space-y-4 flex-1">
            {allQuestions[currentQ].opts.map((opt, idx) => (
              <label key={idx} className={\`block border-2 \${answers[currentQ] === idx ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-xl p-5 cursor-pointer hover:bg-gray-50 flex items-center gap-4 transition-all\`}>
                <input type="radio" name={\`q-\${currentQ}\`} className="w-5 h-5 text-blue-600 focus:ring-blue-500" checked={answers[currentQ] === idx} onChange={() => setAnswers(prev => ({...prev, [currentQ]: idx}))} />
                <span className="text-gray-700 text-lg">{opt}</span>
              </label>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between shrink-0">
            <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} className="px-5 sm:px-8 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition disabled:opacity-50" disabled={currentQ === 0}>Previous</button>
            <button onClick={() => { if(currentQ < 39) setCurrentQ(currentQ + 1); else setSubmitted(true); }} className="px-5 sm:px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition shadow-lg">{currentQ === 39 ? 'Finish Test' : 'Save & Next'}</button>
          </div>
        </div>

        <div className="w-full md:w-1/3 p-4 sm:p-6 flex flex-col bg-gray-50 overflow-y-auto">
          <h5 className="font-black text-gray-800 text-lg mb-6 border-b border-gray-200 pb-3">Question Palette</h5>
          <div className="grid grid-cols-5 gap-2 mb-8 pr-2">
            {allQuestions.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentQ(idx)} className={\`h-12 w-full rounded-lg font-bold transition \${answers[idx] !== undefined ? 'bg-green-500 text-white shadow' : currentQ === idx ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300'}\`}>
                {idx + 1}
              </button>
            ))}
          </div>
          
          <div className="mt-auto bg-white p-4 rounded-xl border border-gray-200 mb-6 space-y-2">
             <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 bg-green-500 rounded"></div> <span className="text-gray-600 font-medium">Answered ({Object.keys(answers).length})</span></div>
             <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div> <span className="text-gray-600 font-medium">Not Visited ({40 - Object.keys(answers).length})</span></div>
          </div>

          <button onClick={() => { if(window.confirm('Are you sure you want to submit the test?')) setSubmitted(true); }} className="w-full bg-red-500 text-white font-bold py-4 rounded-xl hover:bg-red-600 transition shadow-lg text-lg uppercase tracking-wider">Submit Test</button>
        </div>
      </div>
    </div>
  );
};
`

content = content.replace("const Modal =", trialTestEngineCode + "\n\nconst Modal =");

const oldPracticeModal = `{config.type === 'practice' && (
          <div className="space-y-4">
            {!user ? (
               <div className="text-center p-4">
                  <h4 className="text-xl font-bold mb-2">Login Required</h4>
                  <p className="text-sm text-gray-600 mb-4">You need to log in to access your 2-day free trial for questions practice.</p>
                  <button onClick={() => { onClose(); onAction("Login to your account", "login"); }} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Login to Start Trial</button>
               </div>
            ) : trialEndsAt > Date.now() ? (
               <div className="text-center p-4">
                  <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 font-bold text-sm">
                     <CheckCircle2 className="inline-block w-5 h-5 mr-1 align-sub"/> Trial Active
                  </div>
                  <p className="text-gray-600 text-sm mb-4">You have {( (trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24)).toFixed(1)} days left in your free trial.</p>
                  
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-left mb-4">
                      <h5 className="font-bold text-gray-800 mb-2">Sample Question (NEET Level)</h5>
                      <p className="text-sm text-gray-700 mb-3">Which of the following is responsible for the transport of water and minerals from roots to stems and leaves?</p>
                      <div className="space-y-2">
                         <label className="block bg-white border p-2 rounded cursor-pointer hover:bg-blue-50"><input type="radio" name="q1" className="mr-2"/> Phloem</label>
                         <label className="block bg-white border p-2 rounded cursor-pointer hover:bg-blue-50"><input type="radio" name="q1" className="mr-2"/> Xylem</label>
                         <label className="block bg-white border p-2 rounded cursor-pointer hover:bg-blue-50"><input type="radio" name="q1" className="mr-2"/> Cortex</label>
                         <label className="block bg-white border p-2 rounded cursor-pointer hover:bg-blue-50"><input type="radio" name="q1" className="mr-2"/> Epidermis</label>
                      </div>
                  </div>
                  <button className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 shadow-sm transition">Submit Answer</button>
               </div>
            ) : (
               <div className="text-center p-4">
                  <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 font-bold text-sm">
                     Your 2-Day Trial Has Expired
                  </div>
                  <p className="text-gray-600 text-sm mb-4">To continue practicing questions and accessing premium batches, please purchase a subscription.</p>
                  <button onClick={() => { onClose(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-sm transition">View Pricing</button>
               </div>
            )}
          </div>
        )}`;

const newPracticeModal = `{config.type === 'practice' && (
          <>
            {!user ? (
               <div className="text-center p-6 space-y-4">
                  <h4 className="text-2xl font-extrabold text-gray-800 mb-2">Login Required</h4>
                  <p className="text-gray-600 mb-6 max-w-sm mx-auto">Create a free account or log in to instantly unlock your 2-day free trial and access our NEET PYQ Mock Tests.</p>
                  <button onClick={() => { onClose(); setTimeout(() => onAction("Login to your account", "login"), 100); }} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition">Login to Start Trial</button>
               </div>
            ) : trialEndsAt > Date.now() ? (
               <TrialTestEngine onClose={onClose} />
            ) : (
               <div className="text-center p-6 space-y-4">
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 font-bold text-lg">
                     Your 2-Day Trial Has Expired
                  </div>
                  <p className="text-gray-600 mb-8 text-lg">Your free trial access to the test series has ended. To continue practicing questions and unlock our premium batches, please check out our subscription plans.</p>
                  <button onClick={() => { onClose(); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 300); }} className="w-full sm:w-auto bg-orange-500 text-white px-10 py-4 font-bold rounded-xl hover:bg-orange-600 shadow-xl transition text-lg tracking-wide">View Premium Plans</button>
               </div>
            )}
          </>
        )}`;

content = content.replace(oldPracticeModal, newPracticeModal);

const isWiderStr = `const isWider = config.type === 'practice' && user && trialEndsAt > Date.now();`;
const oldModalDiv = `<motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-md relative overflow-y-auto max-h-[90vh]"
      >`;
const newModalDiv = `${isWiderStr}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={\`bg-white shadow-2xl w-full relative overflow-hidden \${isWider ? 'max-w-6xl rounded-xl h-[95vh] sm:h-[90vh] flex flex-col p-0' : 'max-w-md rounded-2xl p-5 sm:p-6 overflow-y-auto max-h-[90vh]'}\`}
      >`;
content = content.replace(oldModalDiv, newModalDiv);

const oldModalTitle = `<h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pr-6">{config.title}</h3>`;
const newModalTitle = `{!isWider && <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pr-6">{config.title}</h3>}`;
content = content.replace(oldModalTitle, newModalTitle);

const oldCloseBtn = `<button onClick={onClose} className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-400 hover:text-gray-600 p-1">`;
const newCloseBtn = `<button onClick={onClose} className={\`absolute p-1 z-50 \${isWider ? 'right-2 sm:right-4 top-2 sm:top-4 text-white hover:text-gray-200' : 'right-3 sm:right-4 top-3 sm:top-4 text-gray-400 hover:text-gray-600'}\`}>`;
content = content.replace(oldCloseBtn, newCloseBtn);

fs.writeFileSync('src/App.tsx', content);

} catch (error) {
  console.error(error);
}
