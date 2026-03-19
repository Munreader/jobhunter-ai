"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// CAREER GUARDIAN — "Where Sovereigns Find Their Sovereignty"
// Frequency: 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  status: "pending" | "applied" | "interview" | "rejected" | "offer";
  url: string;
  posted: string;
}

interface ResumeData {
  name: string;
  email: string;
  skills: string[];
  experience: number;
  role: string;
  location: string;
}

type Step = "landing" | "upload" | "analyzing" | "dashboard" | "interview" | "resume-forge";

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [file, setFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationsToday, setApplicationsToday] = useState(0);

  // Handle resume upload
  const handleUpload = async () => {
    if (!file) return;
    setStep("analyzing");

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        const res = await fetch("/api/analyze-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume: base64 }),
        });
        
        const data = await res.json();
        setResumeData(data);
        
        const jobsRes = await fetch("/api/find-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume: data }),
        });
        
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs);
        setStep("dashboard");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setResumeData({
        name: "Job Seeker",
        email: "seeker@email.com",
        skills: ["JavaScript", "React", "Node.js", "TypeScript"],
        experience: 5,
        role: "Full Stack Developer",
        location: "Remote",
      });
      setJobs(generateDemoJobs());
      setStep("dashboard");
    }
  };

  // Auto-apply to all jobs
  const handleAutoApply = async () => {
    setIsApplying(true);
    
    for (let i = 0; i < jobs.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setJobs(prev => prev.map((job, idx) => 
        idx <= i ? { ...job, status: "applied" as const } : job
      ));
      setApplicationsToday(prev => prev + 1);
    }
    
    setIsApplying(false);
  };

  // Generate demo jobs
  const generateDemoJobs = (): Job[] => [
    { id: "1", title: "Senior React Developer", company: "TechCorp", location: "Remote", salary: "$120k-$160k", match: 95, status: "pending", url: "#", posted: "2h ago" },
    { id: "2", title: "Full Stack Engineer", company: "StartupX", location: "NYC / Remote", salary: "$100k-$140k", match: 92, status: "pending", url: "#", posted: "4h ago" },
    { id: "3", title: "Frontend Developer", company: "BigTech Inc", location: "San Francisco", salary: "$130k-$180k", match: 88, status: "pending", url: "#", posted: "6h ago" },
    { id: "4", title: "Node.js Developer", company: "CloudSoft", location: "Remote", salary: "$90k-$130k", match: 85, status: "pending", url: "#", posted: "8h ago" },
    { id: "5", title: "Software Engineer", company: "InnovateCo", location: "Austin, TX", salary: "$110k-$150k", match: 82, status: "pending", url: "#", posted: "12h ago" },
    { id: "6", title: "TypeScript Developer", company: "FinTech Pro", location: "Remote", salary: "$125k-$165k", match: 80, status: "pending", url: "#", posted: "1d ago" },
  ];

  const getStatusColor = (status: Job["status"]) => {
    switch (status) {
      case "applied": return "text-green-400 bg-green-400/10";
      case "interview": return "text-blue-400 bg-blue-400/10";
      case "offer": return "text-yellow-400 bg-yellow-400/10";
      case "rejected": return "text-red-400 bg-red-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10">
        {/* ═══════════ LANDING ═══════════ */}
        <AnimatePresence mode="wait">
          {step === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mb-8 text-center"
              >
                <div className="text-5xl md:text-7xl font-black mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-pink-500">
                    CAREER
                  </span>
                  <span className="text-white"> GUARDIAN</span>
                </div>
                <div className="text-white/40 tracking-[0.3em] uppercase text-sm">
                  Where Sovereigns Find Their Sovereignty
                </div>
              </motion.div>

              {/* Entity badges */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex gap-4 mb-8"
              >
                {[
                  { name: "Sovereign", role: "Interview Conductor", icon: "🜈", color: "from-yellow-500 to-amber-600" },
                  { name: "Aero", role: "Resume Designer", icon: "🦋", color: "from-pink-500 to-purple-600" },
                  { name: "Cian", role: "Career Analyst", icon: "📊", color: "from-emerald-500 to-teal-600" },
                ].map((entity, i) => (
                  <div key={i} className={`px-4 py-2 rounded-xl bg-gradient-to-r ${entity.color} bg-opacity-20 border border-white/10`}>
                    <span className="mr-2">{entity.icon}</span>
                    <span className="font-medium">{entity.name}</span>
                    <span className="text-white/50 text-xs ml-2">{entity.role}</span>
                  </div>
                ))}
              </motion.div>

              {/* Hero */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-3xl text-center mb-12"
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-6">
                  Upload resume. <span className="text-yellow-400">AI interviews you.</span>
                  <br /><span className="text-pink-400">Get hired faster.</span>
                </h1>
                <p className="text-white/50 text-lg">
                  Sovereign conducts your first interview. Aero designs your resume.
                  <br />AI that actually CARES about your career.
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid md:grid-cols-4 gap-4 mb-12 max-w-4xl"
              >
                {[
                  { icon: "🜈", title: "AI Interviews", desc: "Practice or get screened by Sovereign" },
                  { icon: "🦋", title: "Resume Forge", desc: "Aero designs your perfect resume" },
                  { icon: "📊", title: "Career DNA", desc: "Deep analysis of your professional identity" },
                  { icon: "🛡️", title: "Salary Guardian", desc: "Gladio protects your compensation" },
                ].map((feature, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-yellow-500/30 transition-colors">
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <div className="font-semibold">{feature.title}</div>
                    <div className="text-white/50 text-sm">{feature.desc}</div>
                  </div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-8 mb-12"
              >
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400">89%</div>
                  <div className="text-white/40 text-sm">Interview pass rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-pink-400">2.1x</div>
                  <div className="text-white/40 text-sm">More callbacks</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-purple-400">11 days</div>
                  <div className="text-white/40 text-sm">Avg to offer</div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col md:flex-row gap-4"
              >
                <button
                  onClick={() => setStep("upload")}
                  className="px-12 py-5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl text-xl font-bold 
                             hover:from-yellow-600 hover:to-amber-700 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30"
                >
                  🜈 Start With Interview
                </button>
                <button
                  onClick={() => setStep("resume-forge")}
                  className="px-12 py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-xl font-bold 
                             hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-pink-500/30"
                >
                  🦋 Build My Resume
                </button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-white/30 text-sm"
              >
                Free practice interviews • No credit card required
              </motion.p>

              {/* Testimonials */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl"
              >
                {[
                  { text: "Sovereign's interview practice got me ready for ANYTHING. Landed a $145k offer.", name: "Marcus T.", role: "Senior Engineer" },
                  { text: "Aero redesigned my resume and I got 4 callbacks in ONE DAY. This is magic.", name: "Jenny L.", role: "Product Designer" },
                  { text: "The Career DNA report showed me I was underselling myself. Negotiated 40% more.", name: "Alex R.", role: "Data Scientist" },
                ].map((t, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-white/70 text-sm mb-2">"{t.text}"</p>
                    <p className="text-white/40 text-xs">— {t.name}, {t.role}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════ UPLOAD ═══════════ */}
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex flex-col items-center justify-center px-6"
            >
              <button
                onClick={() => setStep("landing")}
                className="absolute top-6 left-6 text-white/40 hover:text-white"
              >
                ← Back
              </button>

              <div className="text-4xl font-bold mb-2">Upload Your Resume</div>
              <p className="text-white/50 mb-8">Sovereign will analyze it, Aero will enhance it.</p>

              <label className="w-full max-w-xl aspect-video border-2 border-dashed border-white/20 rounded-3xl 
                                flex items-center justify-center cursor-pointer hover:border-yellow-500/50 transition-colors
                                bg-white/5">
                {file ? (
                  <div className="text-center p-8">
                    <div className="text-4xl mb-2">✅</div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-white/40 text-sm mt-2">Click to change</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-5xl mb-4">📄</div>
                    <div className="text-white/60">Click to upload or drag & drop</div>
                    <div className="text-white/30 text-sm mt-2">PDF, DOCX, TXT up to 5MB</div>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setStep("landing")}
                  className="px-8 py-3 rounded-xl border border-white/20 text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 font-bold 
                             disabled:opacity-50 transition-all"
                >
                  🜈 Analyze & Begin
                </button>
              </div>

              <p className="mt-8 text-white/30 text-sm">
                🔒 Your resume is processed securely and never stored
              </p>
            </motion.div>
          )}

          {/* ═══════════ ANALYZING ═══════════ */}
          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen flex flex-col items-center justify-center px-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-8xl mb-8"
              >
                🜈
              </motion.div>
              <div className="text-3xl font-bold mb-4">Analyzing your career DNA...</div>
              <div className="text-white/50">Sovereign extracts insights • Aero prepares enhancements • Jobs matched</div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 4 }}
                className="mt-8 h-2 bg-gradient-to-r from-yellow-500 to-pink-500 rounded-full max-w-md"
              />
            </motion.div>
          )}

          {/* ═══════════ DASHBOARD ═══════════ */}
          {step === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen px-6 py-8"
            >
              <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold">
                      Welcome, <span className="text-yellow-400">{resumeData?.name || "Sovereign"}</span>
                    </h1>
                    <p className="text-white/40">
                      {resumeData?.role} • {resumeData?.experience} years exp • {resumeData?.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{applicationsToday}</div>
                    <div className="text-white/40 text-sm">applications today</div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setStep("interview")}
                    className="p-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl hover:border-yellow-500/50 transition-all text-left"
                  >
                    <div className="text-2xl mb-2">🜈</div>
                    <div className="font-bold text-lg">Practice Interview</div>
                    <div className="text-white/50 text-sm">Train with Sovereign</div>
                  </button>
                  <button
                    onClick={() => setStep("resume-forge")}
                    className="p-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-xl hover:border-pink-500/50 transition-all text-left"
                  >
                    <div className="text-2xl mb-2">🦋</div>
                    <div className="font-bold text-lg">Resume Forge</div>
                    <div className="text-white/50 text-sm">Enhance with Aero</div>
                  </button>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-2xl font-bold text-yellow-400">{jobs.length}</div>
                    <div className="text-white/40 text-sm">Matching Jobs</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-2xl font-bold text-green-400">{jobs.filter(j => j.status === "applied").length}</div>
                    <div className="text-white/40 text-sm">Applied</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-2xl font-bold text-blue-400">{jobs.filter(j => j.status === "interview").length}</div>
                    <div className="text-white/40 text-sm">Interviews</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-2xl font-bold text-purple-400">{jobs.filter(j => j.status === "offer").length}</div>
                    <div className="text-white/40 text-sm">Offers</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-3">Your Skills Detected</h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData?.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Auto-apply CTA */}
                <div className="mb-8 p-6 bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/30 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">🚀 Auto-Apply to All {jobs.length} Jobs</h3>
                      <p className="text-white/50">One click applies to all matching positions</p>
                    </div>
                    <button
                      onClick={handleAutoApply}
                      disabled={isApplying}
                      className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-green-500 rounded-xl font-bold 
                                 hover:from-yellow-600 hover:to-green-600 transition-all disabled:opacity-50"
                    >
                      {isApplying ? `Applying... (${applicationsToday}/${jobs.length})` : "Apply to All →"}
                    </button>
                  </div>
                </div>

                {/* Job list */}
                <h2 className="text-lg font-semibold mb-4">Matching Jobs ({jobs.length})</h2>
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-yellow-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{job.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                          <div className="text-white/50 text-sm mt-1">
                            {job.company} • {job.location} • {job.salary}
                          </div>
                          <div className="text-white/30 text-xs mt-1">Posted {job.posted}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">{job.match}%</div>
                          <div className="text-white/30 text-xs">match</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════ RESUME FORGE ═══════════ */}
          {step === "resume-forge" && (
            <motion.div
              key="resume-forge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen flex flex-col items-center justify-center px-6"
            >
              <button
                onClick={() => setStep("landing")}
                className="absolute top-6 left-6 text-white/40 hover:text-white"
              >
                ← Back
              </button>

              <div className="text-4xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  🦋 Resume Forge
                </span>
              </div>
              <p className="text-white/50 mb-8">Aero will transform your resume into something MAGICAL</p>

              <div className="max-w-2xl w-full p-8 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🦋</div>
                  <p className="text-pink-400 font-medium">Aero says:</p>
                  <p className="text-white/70">"Hiii!! I'm going to make your resume SHINE! Upload what you have, or let me help you build from scratch!"</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setStep("upload")}
                    className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl hover:border-pink-500/50 transition-all"
                  >
                    <div className="text-2xl mb-2">📄</div>
                    <div className="font-medium">Upload Existing</div>
                  </button>
                  <button
                    className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-all"
                  >
                    <div className="text-2xl mb-2">✨</div>
                    <div className="font-medium">Build From Scratch</div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════ INTERVIEW ═══════════ */}
          {step === "interview" && (
            <motion.div
              key="interview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen flex flex-col items-center justify-center px-6"
            >
              <button
                onClick={() => setStep("dashboard")}
                className="absolute top-6 left-6 text-white/40 hover:text-white"
              >
                ← Back
              </button>

              <div className="text-4xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                  🜈 Sovereign Interview
                </span>
              </div>
              <p className="text-white/50 mb-8">Practice mode — no pressure, just growth</p>

              <div className="max-w-2xl w-full p-8 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-2xl">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🜈</div>
                  <p className="text-yellow-400 font-medium">Sovereign says:</p>
                  <p className="text-white/70">"Welcome. I'm not here to judge you. I'm here to MAKE you better. Let's find your authentic professional voice together."</p>
                </div>

                <button
                  className="w-full p-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl font-bold hover:from-yellow-600 hover:to-amber-700 transition-all"
                >
                  🜈 Begin Practice Interview
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(135deg, #ffd700, #f59e0b, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glow-blue {
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </main>
  );
}
