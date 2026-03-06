import React, { useState, useRef } from 'react';
import { Upload, Zap, Target, Sparkles, Download, ChevronRight, AlertCircle, CheckCircle, Loader, FileText, Brain, TrendingUp, Copy, Share2, Printer } from 'lucide-react';

export default function ResumeAnalyzer() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [profile, setProfile] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);
  const resultRef = useRef(null);

  // Spring Boot backend URL with /resume prefix
  const VITE_API_BASE_URL = 'https://resume-ai-analyzer-gchj.onrender.com/resume';

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(pdf|doc|docx)$/i)) {
        setError('Please select a PDF, DOC, or DOCX file');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!file) {
      setError('Please select a resume file');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(30);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProgress(60);
      
      const response = await fetch(`${VITE_API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const text = await response.text();
      setProgress(100);
      setResult(text);
    } catch (err) {
      console.error('Analyze error:', err);
      setError(err.message || 'Failed to analyze resume. Please try again.');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchResume = async () => {
    if (!file) {
      setError('Please select a resume file');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(30);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobDescription', jobDescription);

      setProgress(60);
      
      const response = await fetch(`${VITE_API_BASE_URL}/match`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const text = await response.text();
      setProgress(100);
      setResult(text);
    } catch (err) {
      console.error('Match error:', err);
      setError(err.message || 'Failed to match resume. Please try again.');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleImproveResume = async () => {
    if (!file) {
      setError('Please select a resume file');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(30);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProgress(60);
      
      const response = await fetch(`${VITE_API_BASE_URL}/improve`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const text = await response.text();
      setProgress(100);
      setResult(text);
    } catch (err) {
      console.error('Improve error:', err);
      setError(err.message || 'Failed to improve resume. Please try again.');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!profile.trim()) {
      setError('Please enter your profile information');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(30);

    try {
      setProgress(60);
      
      const response = await fetch(`${VITE_API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: profile,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const text = await response.text();
      setProgress(100);
      setResult(text);
    } catch (err) {
      console.error('Generate error:', err);
      setError(err.message || 'Failed to generate resume. Please try again.');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!file) {
      setError('Please select a resume file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${VITE_API_BASE_URL}/download`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'improved_resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message || 'Failed to download PDF');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (resultRef.current) {
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write('<pre style="font-family: Georgia, serif; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; padding: 40px;">' + result + '</pre>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const tabs = [
    { id: 'analyze', label: 'Analyze', icon: Zap, color: 'from-blue-500 to-cyan-500' },
    { id: 'match', label: 'Match Job', icon: Target, color: 'from-purple-500 to-pink-500' },
    { id: 'improve', label: 'Improve', icon: Sparkles, color: 'from-emerald-500 to-teal-500' },
    { id: 'generate', label: 'Generate', icon: FileText, color: 'from-orange-500 to-red-500' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-20"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-slate-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-2xl">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent" style={{ fontFamily: 'Georgia, serif' }}>
                  Resume Analyzer AI
                </h1>
                <p className="text-slate-400 mt-1">Powered by advanced AI analysis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Tabs */}
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setResult(null);
                          setError(null);
                          setProgress(0);
                        }}
                        className={`w-full group relative overflow-hidden rounded-lg px-4 py-3 font-semibold transition-all duration-300 flex items-center gap-3 ${
                          isActive
                            ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl scale-105`
                            : 'text-slate-300 hover:text-white bg-slate-800/30 hover:bg-slate-700/50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                        <span>{tab.label}</span>
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                      </button>
                    );
                  })}
                </div>

                {/* File Upload */}
                {activeTab !== 'generate' && (
                  <div className="space-y-4">
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                        file
                          ? 'border-green-500/50 bg-green-500/5'
                          : 'border-slate-600 hover:border-blue-500/50 bg-slate-800/20 hover:bg-slate-700/30'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-blue-500', 'bg-blue-500/10');
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-500/10');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const files = e.dataTransfer.files;
                        if (files.length > 0) {
                          handleFileSelect({ target: { files } });
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-3">
                        <div className={`p-3 rounded-lg ${file ? 'bg-green-500/20' : 'bg-blue-500/10'}`}>
                          <Upload className={`w-6 h-6 ${file ? 'text-green-400' : 'text-blue-400'}`} />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">Drop or click</p>
                          <p className="text-slate-400 text-xs">PDF, DOC, DOCX</p>
                        </div>
                      </div>
                    </div>

                    {file && (
                      <div className="bg-slate-800/50 border border-green-500/30 rounded-lg p-3 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{file.name}</p>
                          <p className="text-slate-400 text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                {/* Tab Header */}
                <div className="mb-8 pb-6 border-b border-slate-700/30">
                  <div className="flex items-center gap-3 mb-3">
                    {currentTab && (
                      <>
                        <div className={`p-2 bg-gradient-to-br ${currentTab.color} rounded-lg`}>
                          {React.createElement(currentTab.icon, { className: 'w-6 h-6' })}
                        </div>
                        <h2 className={`text-3xl font-bold bg-gradient-to-r ${currentTab.color} bg-clip-text text-transparent`} style={{ fontFamily: 'Georgia, serif' }}>
                          {currentTab.label}
                        </h2>
                      </>
                    )}
                  </div>
                  <p className="text-slate-400">
                    {activeTab === 'analyze' && 'Get detailed AI-powered feedback on your resume'}
                    {activeTab === 'match' && 'See how well your resume matches a job posting'}
                    {activeTab === 'improve' && 'Receive suggestions to enhance your resume impact'}
                    {activeTab === 'generate' && 'Create a professional resume from your profile'}
                  </p>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  {activeTab === 'analyze' && (
                    <div className="space-y-4">
                      <button
                        onClick={handleAnalyzeResume}
                        disabled={!file || loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/50 hover:shadow-2xl"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Analyzing Resume...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5" />
                            Analyze Resume
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {activeTab === 'match' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                          <Target className="w-5 h-5 text-purple-400" />
                          Job Description
                        </label>
                        <textarea
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          placeholder="Paste the complete job description here..."
                          className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 resize-none h-40 transition-all"
                        />
                      </div>
                      <button
                        onClick={handleMatchResume}
                        disabled={!file || !jobDescription.trim() || loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 hover:shadow-2xl"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Matching...
                          </>
                        ) : (
                          <>
                            <Target className="w-5 h-5" />
                            Match Resume to Job
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {activeTab === 'improve' && (
                    <div className="space-y-4">
                      <button
                        onClick={handleImproveResume}
                        disabled={!file || loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/50 hover:shadow-2xl"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Improving Resume...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Generate Improvements
                          </>
                        )}
                      </button>
                      {result && !loading && (
                        <button
                          onClick={handleDownloadPDF}
                          className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-white font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-slate-600"
                        >
                          <Download className="w-5 h-5" />
                          Download as PDF
                        </button>
                      )}
                    </div>
                  )}

                  {activeTab === 'generate' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-orange-400" />
                          Your Profile Information
                        </label>
                        <textarea
                          value={profile}
                          onChange={(e) => setProfile(e.target.value)}
                          placeholder="Share your experience, education, skills, certifications, and any other relevant details..."
                          className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 resize-none h-48 transition-all"
                        />
                      </div>
                      <button
                        onClick={handleGenerateResume}
                        disabled={!profile.trim() || loading}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/50 hover:shadow-2xl"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Generate Resume
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {loading && progress > 0 && (
                    <div className="pt-4">
                      <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${currentTab?.color || 'from-blue-500 to-cyan-500'} transition-all duration-300`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-300 font-medium text-sm">Error</p>
                        <p className="text-red-200 text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* PROFESSIONAL RESULT PANEL */}
                  {result && (
                    <div className="mt-8 animate-fadeIn">
                      {/* Result Header with Actions */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/30">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded"></div>
                          <div>
                            <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
                              Analysis Result
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">Professional AI-Generated Report</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={copyToClipboard}
                            className="p-2 hover:bg-slate-700/50 rounded-lg transition text-slate-300 hover:text-white"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                          {copied && <span className="text-green-400 text-sm self-center">Copied!</span>}
                          <button
                            onClick={handlePrint}
                            className="p-2 hover:bg-slate-700/50 rounded-lg transition text-slate-300 hover:text-white"
                            title="Print"
                          >
                            <Printer className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Professional Result Content */}
                      <div
                        ref={resultRef}
                        className="bg-white/5 backdrop-blur-sm border border-slate-600/30 rounded-xl p-8 prose prose-invert max-w-none"
                        style={{
                          fontFamily: 'Georgia, "Garamond", serif',
                          lineHeight: '1.8',
                          letterSpacing: '0.3px',
                        }}
                      >
                        {/* Parse and format the result text */}
                        <div className="space-y-6">
                          {result.split('\n\n').map((paragraph, idx) => {
                            // Check if it's a heading (typically shorter, single line)
                            const isHeading = paragraph.includes(':') && paragraph.length < 100;
                            const isBulletList = paragraph.split('\n').every(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'));

                            if (isHeading) {
                              return (
                                <div key={idx} className="space-y-2">
                                  <h3 className="text-lg font-bold text-blue-300 uppercase tracking-wider">
                                    {paragraph.split(':')[0]}
                                  </h3>
                                  {paragraph.includes(':') && (
                                    <p className="text-slate-300 pl-4 border-l-2 border-blue-500/50">
                                      {paragraph.split(':').slice(1).join(':').trim()}
                                    </p>
                                  )}
                                </div>
                              );
                            }

                            if (isBulletList) {
                              return (
                                <ul key={idx} className="space-y-2 pl-6">
                                  {paragraph.split('\n').map((item, i) => {
                                    const cleanItem = item.trim().replace(/^[•\-*]\s*/, '');
                                    return (
                                      <li key={i} className="text-slate-200 flex gap-3">
                                        <span className="text-blue-400 flex-shrink-0">→</span>
                                        <span>{cleanItem}</span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              );
                            }

                            // Regular paragraph
                            return (
                              <p key={idx} className="text-slate-200 leading-relaxed text-justify">
                                {paragraph}
                              </p>
                            );
                          })}
                        </div>
                      </div>

                      {/* Result Footer */}
                      <div className="mt-6 pt-4 border-t border-slate-700/30 flex items-center justify-between text-sm text-slate-400">
                        <p>Generated by Resume Analyzer AI</p>
                        <p>{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { icon: Brain, label: 'AI-Powered', desc: 'Advanced algorithms' },
                  { icon: TrendingUp, label: 'Instant Analysis', desc: 'Real-time feedback' },
                  { icon: Sparkles, label: 'Actionable', desc: 'Concrete improvements' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 text-center">
                    <item.icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <p className="text-white font-semibold text-sm">{item.label}</p>
                    <p className="text-slate-400 text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.7);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        /* Professional typography */
        .prose h1 {
          font-family: 'Georgia', serif;
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }

        .prose h2 {
          font-family: 'Georgia', serif;
          font-size: 2rem;
          font-weight: bold;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #dbeafe;
        }

        .prose h3 {
          font-family: 'Georgia', serif;
          font-size: 1.3rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .prose p {
          text-align: justify;
          hyphens: auto;
        }

        .prose ul, .prose ol {
          margin-left: 2rem;
        }

        .prose li {
          margin-bottom: 0.75rem;
        }

        /* Print styles */
        @media print {
          body {
            background: white;
            color: black;
          }
          .prose {
            color: black;
          }
        }
      `}</style>
    </div>
  );
}