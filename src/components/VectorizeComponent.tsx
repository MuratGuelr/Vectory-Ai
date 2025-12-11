'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useToast } from './ToastProvider';

export default function VectorizeComponent() {
  const { userData } = useAuth();
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [vectorData, setVectorData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Settings State
  const [options, setOptions] = useState({
    colormode: 'color', // 'color' | 'binary'
    hierarchical: 'cutout', // 'stacked' | 'cutout'
    filter_speckle: 4,
    color_precision: 6,
    layer_difference: 16,
    corner_threshold: 60,
    length_threshold: 4,
    splice_threshold: 45,
    path_precision: 8
  });

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
        handleFileSelect(droppedFile);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setVectorData(null);
  };

  const handleVectorize = async () => {
    if (!file || !previewUrl) return;
    setIsProcessing(true);
    setVectorData(null);

    try {
        const electron = (window as any).electron;
        if (!electron) {
             // Fallback for browser dev? (Mock)
             console.warn("Electron not found, using mockup delay");
             setTimeout(() => {
                 setIsProcessing(false);
                 setVectorData('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>');
                 showToast("Vectorization Mock Complete", "success");
             }, 2000);
            return;
        }

        const sysPath = (file as any).path; 
        
        let result;
        if (sysPath) {
            console.log("Using File Path:", sysPath);
            result = await electron.vectorize({ type: 'path', path: sysPath, options });
        } else {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            result = await electron.vectorize({ type: 'base64', content: base64, options });
        }

        if (result.success) {
            setVectorData(result.content);
            showToast("Vectorization Complete!", "success");
        } else {
            throw new Error(result.error || "Unknown error from backend");
        }

    } catch (error: any) {
        console.error("Vectorization failed:", error);
        showToast(`Failed: ${error.message}`, "error");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDownload = () => {
      if (!vectorData) return;
      const blob = new Blob([vectorData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'vectorized-image.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Download started!", "success");
  };

  // Has Credits Check
  const hasCredits = (userData?.credits !== undefined ? userData.credits : 5) > 0;

  // -- VIEWS --

  // 1. Upload View (Empty State - Matches Design/main screen)
  if (!file) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full p-6 md:p-12 relative animate-in fade-in zoom-in duration-500">
            {/* Decorative Gradients */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="flex flex-col w-full max-w-[960px] relative z-0">
                {/* Headline */}
                <div className="text-center mb-10">
                    <h1 className="text-white tracking-tight text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                        Convert Raster to <span className="text-primary">Vector</span> instantly.
                    </h1>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Drag and drop your images to generate high-quality SVG vectors in seconds.
                    </p>
                </div>

                {/* Upload Zone */}
                <div className="w-full">
                    <div 
                        onDrop={onDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => document.getElementById('file-upload-input')?.click()}
                        className="group relative flex flex-col items-center justify-center w-full min-h-[400px] rounded-xl border-2 border-dashed border-border-dark bg-surface-dark/50 hover:bg-surface-dark hover:border-primary transition-all duration-300 ease-out cursor-pointer overflow-hidden"
                    >
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        
                        <div className="flex flex-col items-center gap-6 z-10 px-6 py-10">
                            {/* Icon Circle */}
                            <div className="w-20 h-20 rounded-full bg-background-dark border border-border-dark group-hover:border-primary/50 group-hover:scale-110 flex items-center justify-center shadow-xl transition-all duration-300">
                                <span className="material-symbols-outlined text-4xl text-text-secondary group-hover:text-primary transition-colors">cloud_upload</span>
                            </div>
                            
                            <div className="flex flex-col items-center gap-2 text-center">
                                <p className="text-white text-xl font-bold leading-tight tracking-tight">
                                    Drag image here or <span className="text-primary underline decoration-primary/30 underline-offset-4 group-hover:decoration-primary">Click to Browse</span>
                                </p>
                                <p className="text-text-secondary text-sm font-normal">
                                    Supports JPG, PNG, WEBP up to 10MB
                                </p>
                            </div>

                            <button type="button" onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload-input')?.click(); }} className="mt-4 flex min-w-[140px] items-center justify-center rounded-full h-11 px-6 bg-primary text-background-dark hover:bg-[#34fd55] hover:shadow-[0_0_20px_rgba(19,236,55,0.4)] text-sm font-bold tracking-wide transition-all transform active:scale-95">
                                Browse Files
                            </button>
                        </div>
                        
                        {/* Hidden Input */}
                        <input 
                            id="file-upload-input"
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        />
                    </div>
                </div>

                {/* File Formats Chips */}
                <div className="flex justify-center mt-8 gap-4 flex-wrap">
                    {['JPG', 'PNG', 'WEBP'].map((fmt) => (
                        <div key={fmt} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-border-dark/30 border border-border-dark/50 text-text-secondary text-xs font-medium uppercase tracking-wider hover:bg-border-dark/50 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">image</span>
                            {fmt}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      );
  }

  // 2. Editor View (Result State - Split Layout)
  return (
    <div className="flex h-full w-full animate-in fade-in duration-300">
        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-background-dark overflow-hidden flex items-center justify-center" 
             style={{ backgroundImage: 'radial-gradient(#232f25 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            
            {/* Back Button (Floating) */}
            <button 
                onClick={() => setFile(null)}
                className="absolute top-6 left-6 z-30 p-2 bg-surface-dark/90 text-text-secondary hover:text-white rounded-full border border-border-dark hover:border-primary transition-colors shadow-lg"
                title="Back to Upload"
            >
                <span className="material-symbols-outlined">arrow_back</span>
            </button>

            {/* Canvas Toolbar (Floating) */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-1.5 bg-surface-dark/90 backdrop-blur-md border border-border-dark rounded-full shadow-xl">
                 <button className="w-9 h-9 flex items-center justify-center rounded-full text-text-secondary hover:text-white hover:bg-border-dark transition-colors" title="Zoom Out">
                    <span className="material-symbols-outlined text-[20px]">remove</span>
                 </button>
                 <span className="text-xs font-medium text-text-secondary w-12 text-center select-none">100%</span>
                 <button className="w-9 h-9 flex items-center justify-center rounded-full text-text-secondary hover:text-white hover:bg-border-dark transition-colors" title="Zoom In">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                 </button>
            </div>

            {/* Comparison Container */}
            <div className="relative w-full h-full max-w-4xl max-h-[80vh] m-auto shadow-2xl rounded-lg overflow-hidden border border-border-dark group">
                {/* Checkered Background */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                {/* Content */}
                <div className="flex w-full h-full">
                    {/* Left: Original */}
                    <div className="flex-1 bg-surface-dark/50 relative border-r border-border-dark flex items-center justify-center p-4">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={previewUrl!} className="max-w-full max-h-full object-contain" alt="Original" />
                         <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                            <span className="text-xs font-bold text-white tracking-wider uppercase">Original</span>
                        </div>
                    </div>
                    
                    {/* Right: Vector */}
                    <div className="flex-1 bg-background-dark/50 relative flex items-center justify-center p-4">
                         {vectorData ? (
                            <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: vectorData }} />
                         ) : (
                            <div className="flex flex-col items-center gap-3 text-text-secondary">
                                <span className="material-symbols-outlined text-4xl animate-pulse">auto_mode</span>
                                <span className="text-sm font-medium">Waiting for process...</span>
                            </div>
                         )}
                         <div className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                            <span className="text-xs font-bold text-[#111812] tracking-wider uppercase">Vector Result</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Sidebar (Settings) */}
        <aside className="w-80 h-full bg-surface-dark border-l border-border-dark flex flex-col shrink-0 z-20 overflow-y-auto">
            {/* Header Image Area */}
            <div className="relative h-40 w-full shrink-0 bg-background-dark flex items-end p-6 border-b border-border-dark">
                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-white tracking-tight">Vector Settings</h2>
                    <p className="text-text-secondary text-xs mt-1">Adjust parameters to refine output</p>
                </div>
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            {/* Scrollable Settings */}
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
                
                {/* Mode Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white uppercase tracking-wider">Vectorization Mode</label>
                    <div className="flex bg-background-dark rounded-xl p-1 border border-border-dark">
                        {['color', 'binary'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setOptions({...options, colormode: mode})}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg uppercase tracking-wide transition-all ${
                                    options.colormode === mode ? 'bg-primary text-background-dark shadow-sm' : 'text-text-secondary hover:text-white'
                                }`}
                            >
                                {mode === 'color' ? 'Color' : 'B&W'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Detail Level Slider (Path Precision) */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-white uppercase tracking-wider">Detail Level</label>
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{options.path_precision}</span>
                    </div>
                    <input 
                        type="range" min="1" max="10" 
                        value={options.path_precision}
                        onChange={(e) => setOptions({...options, path_precision: parseInt(e.target.value)})}
                        className="w-full accent-primary bg-border-dark rounded-lg appearance-none h-1 cursor-pointer"
                    />
                </div>

                {/* Speckle Filter */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-white uppercase tracking-wider">Speckle Filter</label>
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{options.filter_speckle}</span>
                    </div>
                    <input 
                        type="range" min="1" max="16" 
                        value={options.filter_speckle}
                        onChange={(e) => setOptions({...options, filter_speckle: parseInt(e.target.value)})}
                        className="w-full accent-primary bg-border-dark rounded-lg appearance-none h-1 cursor-pointer"
                    />
                </div>

                {/* Processing Button */}
                <button 
                    disabled={isProcessing}
                    onClick={handleVectorize}
                    className="w-full py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all bg-border-dark hover:bg-border-dark/80 text-white mt-2 border border-white/5"
                >
                   {isProcessing ? (
                       <span className="flex items-center gap-2">
                           <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                           Processing...
                       </span>
                   ) : (
                       <>
                           <span className="material-symbols-outlined text-[18px]">refresh</span>
                           Re-Process
                       </>
                   )}
                </button>

            </div>

            {/* Bottom Action Bar */}
            {vectorData && (
            <div className="p-6 bg-surface-dark border-t border-border-dark w-full">
                 <button 
                    disabled={!hasCredits}
                    onClick={handleDownload}
                    className={`flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-12 px-4 font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(19,236,55,0.15)] active:scale-[0.98] ${
                        hasCredits ? 'bg-primary text-background-dark hover:bg-[#3af558] hover:scale-[1.02]' : 'bg-border-dark text-text-secondary cursor-not-allowed'
                    }`}
                >
                    <span className="material-symbols-outlined text-[20px] font-bold">download</span>
                    <span>Download Vector</span>
                    <span className="bg-[#111812]/10 px-2 py-0.5 rounded text-[10px] font-mono ml-1">{hasCredits ? '1 CREDIT' : '0 CREDIT'}</span>
                </button>
            </div>
            )}
        </aside>
    </div>
  );
}

