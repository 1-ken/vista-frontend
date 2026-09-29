import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, CheckCircle2, XCircle, AlertTriangle, Download, X, RefreshCw } from 'lucide-react';
import api from '../../api/axios';

const REQUIRED_COLS = ['title', 'description', 'price', 'duration', 'location'];

const TEMPLATE_ROWS = [
  ['title', 'description', 'price', 'duration', 'location', 'category', 'image', 'tag', 'availability'],
  ['Maasai Mara Safari', 'Witness the Great Migration in luxury tented camps.', 1250, '3 Days 2 Nights', 'Maasai Mara, Kenya', 'Safari', 'https://example.com/mara.jpg', 'Best Seller', 'true'],
  ['Dubai Skyline Escape', 'Modern luxury meets desert adventure.', 1850, '5 Days 4 Nights', 'Dubai, UAE', 'City', 'https://example.com/dubai.jpg', 'Top Rated', 'true'],
];

const downloadTemplate = () => {
  const csv = TEMPLATE_ROWS.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'packages_template.csv'; a.click();
  URL.revokeObjectURL(url);
};

const PackagesImport = ({ onImportDone }) => {
  const [dragging,  setDragging]  = useState(false);
  const [file,      setFile]      = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result,    setResult]    = useState(null); // { created, skipped, errors[] }
  const [error,     setError]     = useState('');
  const inputRef = useRef();

  const accept = '.xlsx,.xls,.csv';

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['xlsx','xls','csv'].includes(ext)) {
      setError('Only .xlsx, .xls, or .csv files are accepted.');
      return;
    }
    setFile(f);
    setResult(null);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setResult(null);

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await api.post('/tours/import', form);
      setResult(res.data);
      if (onImportDone) onImportDone();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setError(''); };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-serif text-primary mb-1">Excel Package Import</h2>
          <p className="text-xs text-primary/50 font-medium uppercase tracking-widest">
            Upload .xlsx · .xls · .csv — each row becomes a package
          </p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 border border-accent/40 text-accent px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all whitespace-nowrap"
        >
          <Download size={14} /> Download Template
        </button>
      </div>

      {/* Required columns info */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-4 flex flex-wrap gap-3 items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/50">Required columns:</span>
        {REQUIRED_COLS.map(c => (
          <span key={c} className="bg-primary text-accent text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{c}</span>
        ))}
        <span className="text-[10px] text-primary/40 ml-2">Optional: category · image · tag · availability · inclusions · exclusions</span>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer
          ${dragging ? 'border-accent bg-accent/5 scale-[1.01]' : file ? 'border-primary/20 bg-primary/5 cursor-default' : 'border-gray-200 hover:border-accent/50 hover:bg-accent/5'}`}
      >
        <input ref={inputRef} type="file" accept={accept} className="hidden"
          onChange={(e) => handleFile(e.target.files[0])} />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div key="file" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <FileSpreadsheet size={28} className="text-accent" />
              </div>
              <div>
                <p className="font-bold text-primary text-sm">{file.name}</p>
                <p className="text-xs text-primary/40 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); reset(); }}
                className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-600 font-bold uppercase tracking-widest">
                <X size={12} /> Remove
              </button>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${dragging ? 'bg-accent' : 'bg-gray-100'}`}>
                <Upload size={28} className={dragging ? 'text-white' : 'text-gray-400'} />
              </div>
              <div>
                <p className="font-bold text-primary text-sm">Drop your spreadsheet here</p>
                <p className="text-xs text-primary/40 mt-1">or click to browse — .xlsx, .xls, .csv</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs font-bold text-red-600">{error}</p>
        </motion.div>
      )}

      {/* Upload button */}
      {file && !result && (
        <motion.button
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white py-5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
        >
          {uploading ? (
            <><RefreshCw size={16} className="animate-spin" /> Processing spreadsheet...</>
          ) : (
            <><Upload size={16} /> Import Packages from {file.name}</>
          )}
        </motion.button>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

            {/* Summary bar */}
            <div className="bg-primary px-8 py-6 flex flex-wrap gap-8 items-center">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-accent" />
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Created</p>
                  <p className="text-2xl font-serif text-accent">{result.created}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-white/40" />
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Skipped</p>
                  <p className="text-2xl font-serif text-white">{result.skipped}</p>
                </div>
              </div>
              {result.errors?.length > 0 && (
                <div className="flex items-center gap-3">
                  <XCircle size={20} className="text-red-400" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Errors</p>
                    <p className="text-2xl font-serif text-red-400">{result.errors.length}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 space-y-4">
              {result.created > 0 && (
                <p className="text-sm text-emerald-600 font-bold">
                  ✓ {result.created} package{result.created !== 1 ? 's' : ''} successfully imported and live on the frontend.
                </p>
              )}
              {result.skipped > 0 && (
                <p className="text-xs text-primary/50 font-medium">
                  {result.skipped} row{result.skipped !== 1 ? 's' : ''} skipped (duplicates or missing required fields).
                </p>
              )}
              {result.errors?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Row Errors:</p>
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{e}</p>
                  ))}
                </div>
              )}
              <button onClick={reset}
                className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/50 hover:text-primary transition-colors">
                <RefreshCw size={12} /> Import Another File
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Column guide */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-50">
          <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Column Reference</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                {['Column Name','Required','Example','Notes'].map(h => (
                  <th key={h} className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-primary/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {[
                ['title',       '✓','Maasai Mara Safari','Unique package name'],
                ['description', '✓','Experience the wild...','Full description'],
                ['price',       '✓','1250','Number in KSH'],
                ['duration',    '✓','3 Days 2 Nights','Text format'],
                ['location',    '✓','Maasai Mara, Kenya','Destination'],
                ['category',    '','Safari','Safari, City, Beach, etc.'],
                ['image',       '','https://...jpg','Full image URL'],
                ['tag',         '','Best Seller','Badge label'],
                ['availability','','true','true or false'],
                ['inclusions',  '','Meals|Transfers|Guides','Pipe-separated list'],
                ['exclusions',  '','Flights|Visa','Pipe-separated list'],
              ].map(([col, req, ex, note]) => (
                <tr key={col} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3 font-bold text-primary">{col}</td>
                  <td className="px-6 py-3 text-accent font-bold">{req}</td>
                  <td className="px-6 py-3 text-primary/50 font-mono">{ex}</td>
                  <td className="px-6 py-3 text-primary/40">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PackagesImport;
