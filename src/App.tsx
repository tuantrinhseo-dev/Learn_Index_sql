/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Zap, 
  BookOpen, 
  Activity, 
  Settings, 
  Trophy, 
  ChevronRight, 
  Code,
  ShieldCheck,
  AlertCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { dbSimulator } from './lib/engine';
import { lessons, exercises } from './data/content';
import { cn } from './lib/utils';
import { Exercise, QueryResult } from './types';

type Tab = 'Học tập' | 'Thực hành' | 'Bài tập' | 'Scenarios' | 'Thống kê';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Học tập');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [userIndexes, setUserIndexes] = useState<{ [table: string]: string[] }>({
    users: ['id'],
    products: ['id'],
    orders: ['id']
  });
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  // Lab State
  const [labTable, setLabTable] = useState<'users' | 'products' | 'orders'>('users');
  const [labValue, setLabValue] = useState('user_500@example.com');
  const [labResult, setLabResult] = useState<QueryResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('index_master_progress');
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedExercises(data.completed || []);
      setScore(data.score || 0);
    }
  }, []);

  const saveProgress = (newCompleted: string[]) => {
    setCompletedExercises(newCompleted);
    const newScore = newCompleted.length * 100;
    setScore(newScore);
    localStorage.setItem('index_master_progress', JSON.stringify({
      completed: newCompleted,
      score: newScore
    }));
  };

  const handleRunQuery = () => {
    const col = labTable === 'users' ? 'email' : labTable === 'products' ? 'category' : 'status';
    const result = dbSimulator.executeQuery(labTable, col, labValue);
    setLabResult(result);

    // If in an exercise, check winning criteria
    if (activeExercise && result.rowsScanned <= activeExercise.winningCriteria.maxRowsScanned) {
      if (!completedExercises.includes(activeExercise.id)) {
        saveProgress([...completedExercises, activeExercise.id]);
      }
    }
  };

  const toggleIndex = (col: string) => {
    const table = activeExercise?.targetTable || labTable;
    if (userIndexes[table].includes(col)) {
      dbSimulator.removeIndex(table, col);
      setUserIndexes(prev => ({ ...prev, [table]: prev[table].filter(c => c !== col) }));
    } else {
      dbSimulator.addIndex(table, col);
      setUserIndexes(prev => ({ ...prev, [table]: [...prev[table], col] }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-4 z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Database className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight uppercase text-lg">IndexMaster</h1>
            <p className="text-[10px] text-slate-500 font-mono">LAB HIỆU NĂNG SQL</p>
          </div>
        </div>

        <div className="space-y-1 flex-1">
          <NavButton active={activeTab === 'Học tập'} icon={BookOpen} label="Chương Trình" onClick={() => setActiveTab('Học tập')} />
          <NavButton active={activeTab === 'Thực hành'} icon={Play} label="Phòng Thí Nghiệm" onClick={() => setActiveTab('Thực hành')} />
          <NavButton active={activeTab === 'Bài tập'} icon={Trophy} label="Thử Thách" onClick={() => setActiveTab('Bài tập')} />
          <NavButton active={activeTab === 'Thống kê'} icon={Activity} label="Hiệu Năng" onClick={() => setActiveTab('Thống kê')} />
        </div>

        <div className="mt-auto pt-4 border-t border-slate-800">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">Tổng Điểm</span>
              <span className="text-xs font-bold text-indigo-400">{score} XP</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500" 
                style={{ width: `${(completedExercises.length / exercises.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pl-64 min-h-screen">
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 flex items-center justify-between px-8 z-40">
          <h2 className="text-sm font-medium text-slate-400 flex items-center gap-2">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-slate-100">
              {activeTab === 'Học tập' && lessons[currentLessonIndex].title}
              {activeTab === 'Bài tập' && (activeExercise?.title || 'Chọn một thử thách')}
              {activeTab === 'Thực hành' && 'Chế độ Tự do'}
            </span>
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
               {[1, 2, 3].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                   UI
                 </div>
               ))}
            </div>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Settings size={18} className="text-slate-400" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'Học tập' && (
              <motion.div 
                key="learn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
                  
                  <div className="relative">
                    <span className="text-indigo-400 text-xs font-mono mb-2 block tracking-widest">BÀI HỌC {currentLessonIndex + 1}</span>
                    <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">{lessons[currentLessonIndex].title}</h3>
                    <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-lg whitespace-pre-wrap mb-10">
                      {lessons[currentLessonIndex].content}
                    </div>

                    <div className="flex items-center gap-4">
                      {currentLessonIndex > 0 && (
                        <button 
                          onClick={() => setCurrentLessonIndex(v => v - 1)}
                          className="px-6 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors font-medium"
                        >
                          Quay lại
                        </button>
                      )}
                      {currentLessonIndex < lessons.length - 1 && (
                        <button 
                          onClick={() => setCurrentLessonIndex(v => v + 1)}
                          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors font-medium flex items-center gap-2"
                        >
                          Bài tiếp theo <ChevronRight size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {lessons[currentLessonIndex].quiz && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
                     <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                       <HelpCircle className="text-indigo-400" /> Kiểm tra kiến thức
                     </h4>
                     <p className="text-slate-300 mb-6">{lessons[currentLessonIndex].quiz?.question}</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {lessons[currentLessonIndex].quiz?.options.map((opt, i) => (
                         <button 
                          key={i}
                          onClick={() => {
                            if (i === lessons[currentLessonIndex].quiz?.correctIndex) {
                              alert("Chính xác! " + lessons[currentLessonIndex].quiz?.explanation);
                            } else {
                              alert("Chưa đúng rồi. Hãy xem lại bài học nhé.");
                            }
                          }}
                          className="text-left p-4 rounded-xl border border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all text-sm group"
                         >
                           <span className="w-6 h-6 rounded-lg bg-slate-800 inline-flex items-center justify-center mr-3 text-xs font-mono text-slate-500 group-hover:bg-indigo-500 group-hover:text-white">
                             {String.fromCharCode(65 + i)}
                           </span>
                           {opt}
                         </button>
                       ))}
                     </div>
                  </div>
                )}
              </motion.div>
            )}

            {(activeTab === 'Thực hành' || activeExercise) && (
              <motion.div 
                key="lab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Left: Query & Controls */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                  {activeExercise && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-4">
                      <AlertCircle className="text-amber-500 shrink-0 mt-1" />
                      <div>
                        <h4 className="text-amber-400 font-bold text-sm">THỬ THÁCH: {activeExercise.title}</h4>
                        <p className="text-xs text-amber-500/80 mt-1">{activeExercise.description}</p>
                        <div className="flex gap-4 mt-3">
                          <button onClick={() => setActiveExercise(null)} className="text-[10px] uppercase tracking-wider font-bold text-slate-500 hover:text-slate-300">Thoát</button>
                          <button onClick={() => alert(activeExercise.hint)} className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 hover:text-indigo-300">Xem Gợi ý</button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/40" />
                          <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                          <div className="w-3 h-3 rounded-full bg-green-500/40" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase ml-4 tracking-widest">THỰC THI SQL v1.0</span>
                      </div>
                      <select 
                        value={activeExercise?.targetTable || labTable} 
                        onChange={(e) => setLabTable(e.target.value as any)}
                        disabled={!!activeExercise}
                        className="bg-slate-900 border-none text-[11px] font-mono rounded px-2 py-1 text-indigo-400 focus:ring-0 cursor-pointer"
                      >
                        <option value="users">BẢNG [users]</option>
                        <option value="products">BẢNG [products]</option>
                        <option value="orders">BẢNG [orders]</option>
                      </select>
                    </div>

                    <div className="p-6 font-mono text-lg bg-slate-900/50 min-h-[160px] relative group">
                      <div className="flex flex-wrap gap-2 items-center text-indigo-400">
                        <span className="text-slate-500">SELECT</span> * <span className="text-slate-500">FROM</span> {activeExercise?.targetTable || labTable} <span className="text-slate-500 whitespace-nowrap">WHERE cột =</span> 
                        <input 
                          type="text"
                          value={labValue}
                          onChange={(e) => setLabValue(e.target.value)}
                          className="bg-slate-800 border-none rounded px-2 py-1 text-white focus:ring-1 focus:ring-indigo-500/50 w-full md:w-auto mt-2 md:mt-0"
                          placeholder="giá_trị_tìm_kiếm"
                        />
                      </div>
                      <button 
                        onClick={handleRunQuery}
                        className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all font-bold text-sm"
                      >
                        <Play size={16} fill="currentColor" /> CHẠY TRUY VẤN
                      </button>
                    </div>
                  </div>

                  {/* Schema & Index Management */}
                   <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <ShieldCheck size={14} /> Quản lý Index
                    </h5>
                    <div className="flex flex-wrap gap-3">
                      {(activeExercise?.targetTable === 'users' || (!activeExercise && labTable === 'users')) && (
                        ['id', 'username', 'email', 'city', 'country'].map(col => (
                          <IndexBadge 
                            key={col} 
                            name={col} 
                            active={userIndexes.users.includes(col)} 
                            immutable={col === 'id'}
                            onClick={() => toggleIndex(col)} 
                          />
                        ))
                      )}
                      {(activeExercise?.targetTable === 'products' || (!activeExercise && labTable === 'products')) && (
                        ['id', 'name', 'category', 'stock'].map(col => (
                          <IndexBadge 
                            key={col} 
                            name={col} 
                            active={userIndexes.products.includes(col)} 
                            immutable={col === 'id'}
                            onClick={() => toggleIndex(col)} 
                          />
                        ))
                      )}
                      {(activeExercise?.targetTable === 'orders' || (!activeExercise && labTable === 'orders')) && (
                        ['id', 'user_id', 'product_id', 'status'].map(col => (
                          <IndexBadge 
                            key={col} 
                            name={col} 
                            active={userIndexes.orders.includes(col)} 
                            immutable={col === 'id'}
                            onClick={() => toggleIndex(col)} 
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Results & Performance */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-full h-[600px]">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                       <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <BarChart3 size={14} /> Kế hoạch Thực thi
                       </h5>
                       {labResult && (
                         <div className={cn(
                           "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter",
                           labResult.usedIndex ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                         )}>
                           {labResult.usedIndex ? "INDEX SEEK" : "TABLE SCAN"}
                         </div>
                       )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {!labResult ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                          <Activity size={48} className="mb-4" />
                          <p className="text-sm font-medium">Chạy truy vấn để xem thống kê hiệu năng</p>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <StatCard label="Dòng đã Quét" value={labResult.rowsScanned.toLocaleString()} sub="Trên 2,000 dòng" />
                            <StatCard label="Thời gian Thực thi" value={`${labResult.executionTimeMs.toFixed(3)}ms`} sub="Thời gian ước tính" />
                          </div>

                          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <p className="text-xs font-mono text-slate-400 mb-2 leading-relaxed">
                              {labResult.explanation}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <h6 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kết quả Mẫu (10 trên {labResult.data.length})</h6>
                            <div className="bg-slate-950 rounded-lg overflow-x-auto text-[11px] font-mono border border-slate-800">
                               <table className="w-full">
                                 <thead className="bg-slate-900">
                                   <tr>
                                     {labResult.data.length > 0 && Object.keys(labResult.data[0]).slice(0, 4).map(k => (
                                       <th key={k} className="p-2 border-b border-slate-800 text-slate-500 text-left">{k}</th>
                                     ))}
                                   </tr>
                                 </thead>
                                 <tbody>
                                   {labResult.data.slice(0, 10).map((row, i) => (
                                     <tr key={i} className="border-b border-slate-800/50">
                                       {Object.values(row).slice(0, 4).map((v: any, j) => (
                                         <td key={j} className="p-2 text-slate-300">{String(v).length > 20 ? String(v).slice(0, 20) + '...' : String(v)}</td>
                                       ))}
                                     </tr>
                                   ))}
                                 </tbody>
                               </table>
                            </div>
                          </div>

                          {activeExercise && labResult.rowsScanned <= activeExercise.winningCriteria.maxRowsScanned && (
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl flex flex-col items-center text-center"
                            >
                               <CheckCircle2 size={40} className="text-green-500 mb-3" />
                               <h4 className="text-green-400 font-bold text-lg mb-1">Hoàn thành Thử thách!</h4>
                               <p className="text-green-500/70 text-xs mb-4">Bạn đã tối ưu hóa truy vấn thành công. Tuyệt vời!</p>
                               <button 
                                onClick={() => {
                                  setActiveExercise(null);
                                  setLabResult(null);
                                }}
                                className="w-full bg-green-500 text-slate-950 font-bold py-2 rounded-xl text-sm hover:bg-green-400 transition-colors"
                               >
                                 Thử thách Tiếp theo
                               </button>
                            </motion.div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Bài tập' && !activeExercise && (
              <motion.div 
                key="exercises"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Lộ trình Làm chủ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exercises.map((ex) => (
                      <ExerciseCard 
                        key={ex.id} 
                        exercise={ex} 
                        completed={completedExercises.includes(ex.id)}
                        onClick={() => setActiveExercise(ex)} 
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Thống kê' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <Activity className="text-indigo-500 mb-4" />
                    <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">XP Đã tích lũy</h4>
                    <p className="text-3xl font-bold text-white">{score}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <Trophy className="text-amber-500 mb-4" />
                    <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Thử thách hoàn tất</h4>
                    <p className="text-3xl font-bold text-white">{completedExercises.length} / {exercises.length}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <Zap className="text-green-500 mb-4" />
                    <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Hệ số Kỹ năng</h4>
                    <p className="text-3xl font-bold text-white">x1.5</p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
                  <h4 className="text-lg font-bold text-white mb-6">Tiến độ Kiến thức</h4>
                  <div className="space-y-4">
                    <ProgressRow label="Khái niệm Cơ bản" percent={85} />
                    <ProgressRow label="Index Đơn Cột" percent={completedExercises.filter(e => e.startsWith('basic')).length * 10} />
                    <ProgressRow label="Độ phức tạp Thuật toán" percent={completedExercises.filter(e => e.startsWith('int')).length * 10} />
                    <ProgressRow label="Tối ưu hóa Thực tế" percent={completedExercises.filter(e => e.startsWith('adv')).length * 10} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Helper Components
function NavButton({ active, icon: Icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
        active 
          ? "bg-indigo-600/10 text-indigo-400 shadow-inner" 
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
      )}
    >
      <Icon size={18} className={active ? "text-indigo-400" : "text-slate-500"} />
      {label}
    </button>
  );
}

function IndexBadge({ name, active, immutable, onClick }: any) {
  return (
    <button 
      onClick={immutable ? undefined : onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-2",
        active 
          ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" 
          : "bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500",
        immutable && "cursor-not-allowed opacity-80"
      )}
    >
      <Zap size={12} className={active ? "fill-indigo-400" : ""} />
      {name}
      {immutable && <span className="text-[8px] bg-slate-700 px-1 rounded uppercase">PK</span>}
    </button>
  );
}

function StatCard({ label, value, sub }: any) {
  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{label}</span>
      <span className="text-xl font-bold text-white block">{value}</span>
      <span className="text-[9px] text-slate-600 block">{sub}</span>
    </div>
  );
}

function ExerciseCard({ exercise, onClick, completed }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "bg-slate-900 border border-slate-800 p-5 rounded-2xl text-left hover:border-indigo-500 transition-all group relative overflow-hidden",
        completed && "border-green-500/30"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={cn(
          "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
          exercise.level === 'Basic' ? "bg-green-500/10 text-green-500" :
          exercise.level === 'Intermediate' ? "bg-amber-500/10 text-amber-500" :
          "bg-red-500/10 text-red-500"
        )}>
          {exercise.level}
        </span>
        {completed && <CheckCircle2 size={16} className="text-green-500" />}
      </div>
      <h5 className="font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{exercise.title}</h5>
      <p className="text-xs text-slate-500 line-clamp-2">{exercise.description}</p>
      
      {completed && <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500" />}
    </button>
  );
}

function ProgressRow({ label, percent }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5 font-medium">
        <span className="text-slate-400">{label}</span>
        <span className="text-white">{percent}%</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
