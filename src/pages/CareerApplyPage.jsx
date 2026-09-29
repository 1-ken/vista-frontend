import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, CheckCircle, AlertCircle, X, FileText, ChevronRight,
  Mail, Phone, Globe, Linkedin, MapPin, Briefcase, Copy, Check,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EXPERIENCE_OPTIONS = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-8', '8-10', '10+'];
const EDUCATION_OPTIONS  = ['High School', 'Certificate', 'Diploma', "Bachelor's Degree", "Master's Degree", 'PhD'];
const AVAILABILITY_OPTIONS = ['Immediately', '2 Weeks', '1 Month', '2 Months', 'Other'];
const EMP_TYPE_OPTIONS   = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote', 'Hybrid'];


const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '', nationality: '', location: '',
  linkedin: '', portfolio: '', experience: '', education: '', skills: '',
  availability: '', employmentType: '', expectedSalary: '',
  whyUs: '', additionalInfo: '', certified: false, dataConsent: false,
};

export default function CareerApplyPage() {
  const [searchParams]  = useSearchParams();
  const jobId           = searchParams.get('jobId') || '';

  const [job,        setJob]        = useState(null);
  const [jobLoading, setJobLoading] = useState(!!jobId);

  const [form,       setForm]       = useState(EMPTY);
  const [files,      setFiles]      = useState({ cvFile: null, coverLetter: null, certificates: null });
  const [dragOver,   setDragOver]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result,     setResult]     = useState(null); // { applicationRef, screeningResult, status }
  const [error,      setError]      = useState('');
  const [dupWarning, setDupWarning] = useState(false);
  const [copied,     setCopied]     = useState(false);

  const cvRef   = useRef();
  const clRef   = useRef();
  const certRef = useRef();

  // Load job details if jobId provided
  useEffect(() => {
    if (!jobId) { setJobLoading(false); return; }
    fetch(`/api/careers/jobs/${jobId}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setJob(d); setJobLoading(false); })
      .catch(() => { setJob(null); setJobLoading(false); });
  }, [jobId]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const checkDuplicate = async () => {
    if (!form.email || !jobId || !/\S+@\S+\.\S+/.test(form.email)) return;
    try {
      const r = await fetch(`/api/careers/applications/check?email=${encodeURIComponent(form.email)}&jobId=${encodeURIComponent(jobId)}`);
      const d = await r.json();
      setDupWarning(d.exists);
    } catch {}
  };

  const handleFile = useCallback((key, file) => {
    if (!file) return;
    if (!/\.(pdf|doc|docx|jpg|jpeg|png)$/i.test(file.name)) { setError(`Invalid file type: ${file.name}`); return; }
    if (file.size > 5 * 1024 * 1024) { setError('File must be under 5MB'); return; }
    setFiles(f => ({ ...f, [key]: file }));
    setError('');
  }, []);

  const validate = () => {
    if (!form.firstName.trim())  return 'First name is required';
    if (!form.lastName.trim())   return 'Last name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return 'Valid email is required';
    if (!form.phone.trim())      return 'Phone number is required';
    if (!form.location.trim())   return 'Current location is required';
    if (!jobId)                  return 'No position selected. Please apply from a specific job listing.';
    if (!form.experience)        return 'Years of experience is required';
    if (!files.cvFile)           return 'CV / Resume is required';
    if (!files.coverLetter)      return 'Cover letter is required';
    if (!form.certified)         return 'Please certify that your information is accurate';
    if (!form.dataConsent)       return 'Please agree to data processing';
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setError('');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('jobId', jobId);
      // Send position explicitly — satisfies any backend schema that requires it
      fd.append('position', job?.title || jobId);
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) v.forEach(i => fd.append(k, i));
        else fd.append(k, v);
      });
      if (files.cvFile)       fd.append('cvFile',       files.cvFile);
      if (files.coverLetter)  fd.append('coverLetter',  files.coverLetter);
      if (files.certificates) fd.append('certificates', files.certificates);

      const r = await fetch('/api/careers/applications', { method: 'POST', body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || 'Submission failed');
      setResult(d);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyRef = () => {
    navigator.clipboard.writeText(result.applicationRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (result) return <SuccessScreen result={result} job={job} name={form.firstName} onCopy={copyRef} copied={copied} />;

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans">
      <Navbar />

      <section className="bg-primary pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent text-xs uppercase tracking-[0.4em] font-bold mb-3">Join Our Team</p>
          {jobLoading ? (
            <div className="h-12 w-64 bg-white/10 rounded-xl animate-pulse mx-auto" />
          ) : job ? (
            <>
              <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">{job.title}</h1>
              <p className="text-white/50 text-sm">{job.department} · {job.location}</p>
            </>
          ) : (
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">Apply Now</h1>
          )}
        </div>
      </section>

      {/* No jobId warning */}
      {!jobId && (
        <div className="max-w-3xl mx-auto px-6 pt-8">
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-5 py-4 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>Please apply from a specific job listing so we can match your application correctly. <Link to="/careers" className="font-bold underline">View open positions →</Link></span>
          </div>
        </div>
      )}

      {/* Job requirements preview */}
      {job && (job.minimumExperienceYears > 0 || job.requiredDocuments) && (
        <div className="max-w-3xl mx-auto px-6 pt-8">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
            <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Position Requirements</p>
            <div className="flex flex-wrap gap-4 text-sm">
              {job.minimumExperienceYears > 0 && (
                <span className="flex items-center gap-2 text-primary/70">
                  <Briefcase size={13} className="text-accent" />
                  Minimum {job.minimumExperienceYears} year{job.minimumExperienceYears !== 1 ? 's' : ''} experience required
                </span>
              )}
              {job.requiredDocuments?.cv && (
                <span className="flex items-center gap-2 text-primary/70"><CheckCircle size={13} className="text-emerald-500" />CV required</span>
              )}
              {job.requiredDocuments?.coverLetter && (
                <span className="flex items-center gap-2 text-primary/70"><CheckCircle size={13} className="text-emerald-500" />Cover letter required</span>
              )}
              {job.requiredDocuments?.certificates && (
                <span className="flex items-center gap-2 text-primary/70"><CheckCircle size={13} className="text-emerald-500" />Certificates required</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">
        <form onSubmit={submit} className="space-y-8">

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                <AlertCircle size={16} className="flex-shrink-0" />{error}
              </motion.div>
            )}
            {dupWarning && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm">
                <AlertCircle size={16} className="flex-shrink-0" />
                You have already submitted an application for this position.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Personal Information */}
          <Card title="Personal Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="First Name *">
                <input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="John" className={INPUT} />
              </Field>
              <Field label="Last Name *">
                <input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Doe" className={INPUT} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Email Address *" icon={Mail}>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} onBlur={checkDuplicate} placeholder="john@email.com" className={INPUT} />
              </Field>
              <Field label="Phone Number *" icon={Phone}>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+254 700 000 000" className={INPUT} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Nationality">
                <input value={form.nationality} onChange={e => set('nationality', e.target.value)} placeholder="Kenyan" className={INPUT} />
              </Field>
              <Field label="Current Location *" icon={MapPin}>
                <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Nairobi, Kenya" className={INPUT} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="LinkedIn Profile" icon={Linkedin}>
                <input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/yourname" className={INPUT} />
              </Field>
              <Field label="Portfolio / Website (Optional)" icon={Globe}>
                <input value={form.portfolio} onChange={e => set('portfolio', e.target.value)} placeholder="yourwebsite.com" className={INPUT} />
              </Field>
            </div>
          </Card>

          {/* Professional Information */}
          <Card title="Professional Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Years of Experience *">
                <select value={form.experience} onChange={e => set('experience', e.target.value)} className={INPUT}>
                  <option value="">Select</option>
                  {EXPERIENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Highest Education">
                <select value={form.education} onChange={e => set('education', e.target.value)} className={INPUT}>
                  <option value="">Select</option>
                  {EDUCATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Skills">
              <textarea value={form.skills} onChange={e => set('skills', e.target.value)} rows={3}
                placeholder="e.g. Tour Planning, Customer Service, Swahili, Photography, Leadership..."
                className={`${INPUT} resize-none`} />
              <p className="text-xs text-primary/30 mt-1.5">List your skills separated by commas</p>
            </Field>
          </Card>

          {/* Availability */}
          <Card title="Availability">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="When can you start?">
                <div className="flex flex-wrap gap-2">
                  {AVAILABILITY_OPTIONS.map(o => (
                    <button type="button" key={o} onClick={() => set('availability', o)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        form.availability === o ? 'bg-primary text-white border-primary' : 'border-primary/15 text-primary/50 hover:border-primary/30'
                      }`}>{o}</button>
                  ))}
                </div>
              </Field>
              <Field label="Preferred Employment Type">
                <div className="flex flex-wrap gap-2">
                  {EMP_TYPE_OPTIONS.map(o => (
                    <button type="button" key={o} onClick={() => set('employmentType', o)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        form.employmentType === o ? 'bg-primary text-white border-primary' : 'border-primary/15 text-primary/50 hover:border-primary/30'
                      }`}>{o}</button>
                  ))}
                </div>
              </Field>
            </div>
            <Field label="Expected Monthly Salary (Optional)">
              <input value={form.expectedSalary} onChange={e => set('expectedSalary', e.target.value)} placeholder="e.g. KES 80,000" className={INPUT} />
            </Field>
          </Card>

          {/* Uploads */}
          <Card title="Documents">
            <DropZone label={`Upload CV / Resume *${job?.requiredDocuments?.cv ? ' (Required)' : ''}`}
              fileKey="cvFile" file={files.cvFile} accept=".pdf,.doc,.docx" hint="PDF, DOC or DOCX — Max 5MB"
              inputRef={cvRef} dragOver={dragOver} setDragOver={setDragOver}
              onFile={f => handleFile('cvFile', f)} onRemove={() => setFiles(f => ({ ...f, cvFile: null }))} />
            <DropZone label={`Cover Letter (Required)`}
              fileKey="coverLetter" file={files.coverLetter} accept=".pdf,.doc,.docx" hint="Optional"
              inputRef={clRef} dragOver={dragOver} setDragOver={setDragOver}
              onFile={f => handleFile('coverLetter', f)} onRemove={() => setFiles(f => ({ ...f, coverLetter: null }))} />
            <DropZone label={`Certificates${job?.requiredDocuments?.certificates ? ' (Required)' : ' (Optional)'}`}
              fileKey="certificates" file={files.certificates} accept=".pdf,.doc,.docx,.jpg,.png" hint="Academic or professional certificates"
              inputRef={certRef} dragOver={dragOver} setDragOver={setDragOver}
              onFile={f => handleFile('certificates', f)} onRemove={() => setFiles(f => ({ ...f, certificates: null }))} />
          </Card>

          {/* Motivation */}
          <Card title="Why Do You Want to Work With Us?">
            <Field label="">
              <textarea value={form.whyUs} onChange={e => set('whyUs', e.target.value)} rows={5}
                placeholder="Tell us why you're interested in joining our team and what makes you a great fit."
                className={`${INPUT} resize-none`} />
            </Field>
            <Field label="Additional Information">
              <textarea value={form.additionalInfo} onChange={e => set('additionalInfo', e.target.value)} rows={4}
                placeholder="Anything else you'd like us to know?"
                className={`${INPUT} resize-none`} />
            </Field>
          </Card>

          {/* Consent */}
          <Card title="Consent">
            <div className="space-y-4">
              <Checkbox checked={form.certified} onChange={v => set('certified', v)}
                label="I certify that the information provided is accurate and complete to the best of my knowledge." />
              <Checkbox checked={form.dataConsent} onChange={v => set('dataConsent', v)}
                label="I agree to the processing of my personal data for recruitment purposes." />
            </div>
          </Card>

          <button type="submit" disabled={submitting || !jobId}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base hover:bg-accent hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-primary/20">
            {submitting
              ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
              : <>Submit Application <ChevronRight size={18} /></>}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

// ── Success Screen ─────────────────────────────────────────────────────────────
function SuccessScreen({ result, job, name, onCopy, copied }) {
  const isQualified  = result.screeningResult === 'qualified';
  const belowExp     = result.screeningResult === 'below_minimum_experience';
  const incompleteDocs = result.screeningResult === 'incomplete_documents';

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 py-24">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-primary/5 p-10 text-center">

          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring' }}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isQualified ? 'bg-emerald-50' : 'bg-amber-50'
            }`}>
            {isQualified
              ? <CheckCircle size={40} className="text-emerald-500" />
              : <AlertCircle size={40} className="text-amber-500" />}
          </motion.div>

          <h1 className="font-serif text-3xl text-primary mb-3">
            {isQualified ? 'Application Submitted!' : 'Application Received'}
          </h1>

          <p className="text-primary/60 mb-2 leading-relaxed text-sm">
            {isQualified && `Thank you, ${name}. Your application for ${job?.title || 'this position'} has been received and is under review by our HR team.`}
            {belowExp && `Thank you, ${name}. Your application has been saved. Please note this role requires more experience than you've indicated. Our team may still review it.`}
            {incompleteDocs && `Thank you, ${name}. Your application has been saved, but some required documents appear to be missing. Our team may reach out for the missing documents.`}
          </p>

          {/* Reference number */}
          <div className="bg-primary/5 rounded-2xl p-5 my-6">
            <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Your Application Reference</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-xl font-bold text-primary font-mono tracking-wider">{result.applicationRef}</p>
              <button onClick={onCopy}
                className="w-8 h-8 rounded-lg bg-white border border-primary/10 flex items-center justify-center text-primary/40 hover:text-primary hover:border-primary/30 transition-all">
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
            <p className="text-xs text-primary/30 mt-2">Save this reference to track your application status</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link to={`/careers/status?ref=${result.applicationRef}`}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-accent hover:text-primary transition-all flex items-center justify-center gap-2">
              Track Application Status <ChevronRight size={14} />
            </Link>
            <Link to="/careers"
              className="w-full border border-primary/12 text-primary/50 py-3 rounded-xl font-semibold text-sm hover:bg-primary/5 transition-all">
              View More Positions
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-primary/8 shadow-sm overflow-hidden">
      <div className="bg-primary/[0.03] border-b border-primary/8 px-7 py-4">
        <h2 className="font-bold text-primary text-base">{title}</h2>
      </div>
      <div className="px-7 py-6 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      {label && <label className="block text-xs font-bold text-primary/40 uppercase tracking-wider mb-2">{label}</label>}
      <div className={Icon ? 'relative' : ''}>
        {Icon && <Icon size={14} className="absolute left-3.5 top-3.5 text-primary/25 pointer-events-none z-10" />}
        <div className={Icon ? '[&_input]:pl-9 [&_select]:pl-9' : ''}>{children}</div>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div onClick={() => onChange(!checked)}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
          checked ? 'bg-primary border-primary' : 'border-primary/20 group-hover:border-primary/40'
        }`}>
        {checked && <CheckCircle size={12} className="text-white" />}
      </div>
      <span className="text-sm text-primary/60 leading-relaxed">{label}</span>
    </label>
  );
}

function DropZone({ label, fileKey, file, accept, hint, inputRef, dragOver, setDragOver, onFile, onRemove }) {
  return (
    <div>
      <label className="block text-xs font-bold text-primary/40 uppercase tracking-wider mb-2">{label}</label>
      {file ? (
        <div className="flex items-center gap-3 bg-accent/5 border border-accent/20 rounded-xl px-4 py-3">
          <FileText size={16} className="text-accent flex-shrink-0" />
          <span className="text-sm text-primary flex-1 truncate">{file.name}</span>
          <span className="text-xs text-primary/30">{(file.size / 1024).toFixed(0)} KB</span>
          <button type="button" onClick={onRemove} className="text-primary/25 hover:text-red-500 transition-colors"><X size={14} /></button>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(fileKey); }}
          onDragLeave={() => setDragOver(null)}
          onDrop={e => { e.preventDefault(); setDragOver(null); onFile(e.dataTransfer.files?.[0]); }}
          onClick={() => inputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-xl py-8 flex flex-col items-center gap-2 cursor-pointer transition-all ${
            dragOver === fileKey ? 'border-accent bg-accent/5' : 'border-primary/12 hover:border-accent/40 hover:bg-accent/3'
          }`}>
          <Upload size={22} className={dragOver === fileKey ? 'text-accent' : 'text-primary/25'} />
          <span className="text-sm text-primary/50 font-medium">Drop file here or click to upload</span>
          <span className="text-xs text-primary/30">{hint}</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => onFile(e.target.files?.[0])} />
    </div>
  );
}

const INPUT = 'w-full bg-primary/[0.03] border border-primary/10 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/25 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all';
