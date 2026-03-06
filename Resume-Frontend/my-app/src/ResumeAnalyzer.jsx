import React, { useState, useRef } from 'react';
import { Upload, Zap, Target, Sparkles, Download, ChevronRight, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';

export default function ResumeAnalyzer() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [profile, setProfile] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const API_BASE_URL = 'http://localhost:8080/resume';

  // Axios instance
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  });

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
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

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data || err.message || 'Failed to analyze resume');
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

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobDescription', jobDescription);

      const response = await api.post('/match', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data || err.message || 'Failed to match resume');
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

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/improve', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data || err.message || 'Failed to improve resume');
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

    try {
      const response = await api.post('/generate', profile, {
        headers: { 'Content-Type': 'application/json' },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data || err.message || 'Failed to generate resume');
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

      const response = await api.post('/download', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'improved_resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data || err.message || 'Failed to download PDF');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'analyze', label: 'Analyze', icon: Zap },
    { id: 'match', label: 'Match Job', icon: Target },
    { id: 'improve', label: 'Improve', icon: Sparkles },
    { id: 'generate', label: 'Generate', icon: Upload },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Resume Analyzer</h1>
          </div>
          <p className="text-slate-400 text-lg">AI-powered resume analysis, matching, and generation</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Tabs */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-2 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setResult(null);
                        setError(null);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                      {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>

              {/* File Upload Section (for non-generate tabs) */}
              {activeTab !== 'generate' && (
                <div
                  className="relative bg-slate-800/50 backdrop-blur-xl border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500/50 transition-all duration-300 group"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-blue-500', 'bg-blue-500/5');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-500/5');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-500/5');
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      setFile(files[0]);
                      setError(null);
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
                    <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-all">
                      <Upload className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Drop or select file</p>
                      <p className="text-slate-400 text-sm">PDF, DOC, or DOCX</p>
                    </div>
                  </div>
                </div>
              )}

              {file && activeTab !== 'generate' && (
                <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{file.name}</p>
                    <p className="text-slate-400 text-xs">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 space-y-6">
              {/* Content based on active tab */}
              {activeTab === 'analyze' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Analyze Your Resume</h2>
                    <p className="text-slate-400">Get AI-powered feedback on your resume content, structure, and impact</p>
                  </div>
                  <button
                    onClick={handleAnalyzeResume}
                    disabled={!file || loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                    {loading ? 'Analyzing...' : 'Analyze Resume'}
                  </button>
                </div>
              )}

              {activeTab === 'match' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Match Job Description</h2>
                    <p className="text-slate-400">See how well your resume matches a specific job posting</p>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-3">Job Description</label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here..."
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none h-32"
                    />
                  </div>
                  <button
                    onClick={handleMatchResume}
                    disabled={!file || !jobDescription.trim() || loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
                    {loading ? 'Matching...' : 'Match Resume'}
                  </button>
                </div>
              )}

              {activeTab === 'improve' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Improve Your Resume</h2>
                    <p className="text-slate-400">Get AI suggestions to make your resume more impactful and effective</p>
                  </div>
                  <button
                    onClick={handleImproveResume}
                    disabled={!file || loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {loading ? 'Improving...' : 'Improve Resume'}
                  </button>
                  {result && (
                    <button
                      onClick={handleDownloadPDF}
                      disabled={loading}
                      className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                      Download as PDF
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'generate' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Generate Resume</h2>
                    <p className="text-slate-400">Create a professional resume from your profile information</p>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-3">Your Profile</label>
                    <textarea
                      value={profile}
                      onChange={(e) => setProfile(e.target.value)}
                      placeholder="Enter your experience, skills, education, and other details..."
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none h-40"
                    />
                  </div>
                  <button
                    onClick={handleGenerateResume}
                    disabled={!profile.trim() || loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {loading ? 'Generating...' : 'Generate Resume'}
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Result Display */}
              {result && (
                <div className="bg-slate-900/50 border border-slate-600/30 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <h3 className="text-white font-semibold mb-4">Result</h3>
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {result}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}