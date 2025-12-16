const { useState, useEffect, useRef } = React;

// --- Ícones (SVG direto para não depender de biblioteca externa) ---
const IconPrinter = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>;
const IconPenTool = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"></path><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="m2 2 7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>;
const IconMonitor = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
const IconEraser = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>;

// --- Componente Principal ---
const CalligraphyApp = () => {
    const [activeStyle, setActiveStyle] = useState('forma');
    const [activeSection, setActiveSection] = useState('uppercase');
    const [customText, setCustomText] = useState('');
    
    // Digital Mode States
    const [isDigitalMode, setIsDigitalMode] = useState(false);
    const [penColor, setPenColor] = useState('#2563eb'); 
    const [penSize, setPenSize] = useState(3);
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);

    const fontStyles = {
        forma: "font-sans",
        italico: "font-serif italic",
        medieval: "font-medieval",
        jutai: "font-jutai",
    };

    // Canvas resize logic
    useEffect(() => {
        if (isDigitalMode && canvasRef.current) {
            const canvas = canvasRef.current;
            const parent = canvas.parentElement;
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }, [isDigitalMode, activeStyle, activeSection, customText]);

    // Drawing Handlers
    const startDrawing = (e) => {
        if (!isDigitalMode) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        isDrawing.current = true;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
        if(e.type === 'touchstart') document.body.style.overflow = 'hidden';
    };

    const draw = (e) => {
        if (!isDrawing.current || !isDigitalMode) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        e.preventDefault();
    };

    const stopDrawing = () => {
        isDrawing.current = false;
        document.body.style.overflow = 'auto';
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if(canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const styles = [
        { id: 'forma', name: 'Letra de Forma', desc: 'Traços retos, verticais e claros.' },
        { id: 'italico', name: 'Itálico', desc: 'Elegância inclinada com serifas.' },
        { id: 'medieval', name: 'Medieval', desc: 'Estilo gótico com traços grossos.' },
        { id: 'jutai', name: 'Jutai Côrte', desc: 'Cursiva clássica e fluida.' },
    ];

    const exercises = {
        uppercase: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
        lowercase: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
        words: "Amor - Vida - Paz - Luz - Sol - Mar - Céu - Flor - Arte - Dom",
        pangram: "Um pequeno jabuti xereta viu dez cegonhas voando feliz.",
        numbers: "0 1 2 3 4 5 6 7 8 9"
    };

    const renderExerciseRows = () => {
        let content = customText || exercises[activeSection] || exercises.uppercase;
        const rows = Array(6).fill(content);

        return rows.map((text, idx) => (
        <div key={idx} className="mb-4 break-inside-avoid">
            {/* Guideline Container */}
            <div className={`relative border-b-2 transition-colors duration-300 
            ${isDigitalMode 
                ? 'border-indigo-300 bg-indigo-50/30' // Demarcação Azulada
                : 'border-gray-800'} 
            ${activeStyle === 'jutai' ? 'h-24' : 'h-20'}`}>
            
            {/* Linhas Guia */}
            <div className={`absolute top-1/2 w-full border-t border-dashed transition-colors ${isDigitalMode ? 'border-indigo-300 opacity-60' : 'border-gray-300 opacity-50'}`}></div>
            {activeStyle === 'jutai' && (
                <>
                    <div className={`absolute top-1/4 w-full border-t border-dashed transition-colors ${isDigitalMode ? 'border-indigo-200 opacity-50' : 'border-gray-200 opacity-50'}`}></div>
                    <div className={`absolute bottom-1/4 w-full border-t border-dashed transition-colors ${isDigitalMode ? 'border-indigo-200 opacity-50' : 'border-gray-200 opacity-50'}`}></div>
                </>
            )}
            
            {/* Texto Fantasma */}
            <div className={`absolute bottom-1 w-full text-5xl tracking-wider select-none pointer-events-none transition-all duration-300
                ${fontStyles[activeStyle]} 
                ${isDigitalMode 
                    ? 'text-gray-500 opacity-60 font-medium' 
                    : 'text-gray-300 opacity-40'}
                `}>
                {text}
            </div>
            </div>
            
            <div className="text-xs text-gray-400 mt-1 flex justify-between">
            <span>Linha {idx + 1}</span>
            </div>
        </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col md:flex-row">
        
        {/* --- MENU LATERAL --- */}
        <aside className="w-full md:w-80 bg-white border-r border-gray-200 p-6 flex-shrink-0 print:hidden overflow-y-auto h-screen sticky top-0 z-20 shadow-lg md:shadow-none">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
            <IconPenTool size={24} />
            Mestre Calígrafo
            </h1>

            <div className="mb-8 opacity-90">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">1. Estilo de Escrita</h3>
            <div className="space-y-2">
                {styles.map((style) => (
                <button
                    key={style.id}
                    onClick={() => {
                        setActiveStyle(style.id);
                        if(isDigitalMode) setTimeout(clearCanvas, 10);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activeStyle === style.id 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    <div className="font-medium">{style.name}</div>
                    <div className="text-xs text-gray-500">{style.desc}</div>
                </button>
                ))}
            </div>
            </div>

            <div className="mb-8 opacity-90">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">2. Conteúdo</h3>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => {setActiveSection('uppercase'); setCustomText(''); if(isDigitalMode) clearCanvas();}} className={`p-2 text-sm rounded border ${activeSection === 'uppercase' && !customText ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-gray-50'}`}>Maiúsculas</button>
                <button onClick={() => {setActiveSection('lowercase'); setCustomText(''); if(isDigitalMode) clearCanvas();}} className={`p-2 text-sm rounded border ${activeSection === 'lowercase' && !customText ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-gray-50'}`}>Minúsculas</button>
                <button onClick={() => {setActiveSection('numbers'); setCustomText(''); if(isDigitalMode) clearCanvas();}} className={`p-2 text-sm rounded border ${activeSection === 'numbers' && !customText ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-gray-50'}`}>Números</button>
                <button onClick={() => {setActiveSection('words'); setCustomText(''); if(isDigitalMode) clearCanvas();}} className={`p-2 text-sm rounded border ${activeSection === 'words' && !customText ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-gray-50'}`}>Palavras</button>
                <button onClick={() => {setActiveSection('pangram'); setCustomText(''); if(isDigitalMode) clearCanvas();}} className={`col-span-2 p-2 text-sm rounded border ${activeSection === 'pangram' && !customText ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-gray-50'}`}>Frases</button>
            </div>
            </div>

            <div className="mb-8 opacity-90">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">3. Personalizar</h3>
            <input 
                type="text" 
                placeholder="Digite seu texto..." 
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
            />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
                <button 
                onClick={() => {
                    window.focus();
                    window.print();
                }}
                className="w-full bg-white border border-indigo-200 text-indigo-700 py-3 px-4 rounded-lg font-medium shadow-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                >
                <IconPrinter size={20} />
                Imprimir Folha
                </button>
            </div>

            {/* Modo Digital */}
            <div className={`p-4 rounded-xl border-2 transition-all ${isDigitalMode ? 'bg-indigo-50 border-indigo-400 shadow-md' : 'bg-white border-gray-100'}`}>
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <IconMonitor size={16}/> Modo Digital (Tablet)
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                    Escreva na tela usando caneta touch ou mouse.
                </p>
                <button 
                    onClick={() => setIsDigitalMode(!isDigitalMode)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all mb-3 flex items-center justify-center gap-2 ${isDigitalMode ? 'bg-indigo-600 text-white shadow-inner' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                >
                    {isDigitalMode ? 'Desativar Modo Digital' : 'Ativar Modo Digital'}
                </button>
                
                {isDigitalMode && (
                    <div className="space-y-3">
                        <div className="flex gap-2 justify-between">
                            <button onClick={clearCanvas} className="flex-1 bg-red-100 text-red-700 p-2 rounded hover:bg-red-200 text-xs flex flex-col items-center gap-1 transition-colors">
                                <IconEraser size={16}/> Limpar
                            </button>
                        </div>
                        <div>
                            <label className="text-xs text-indigo-800 font-semibold mb-1 block">Cor da Tinta</label>
                            <div className="flex gap-2 justify-center">
                                {['#000000', '#2563eb', '#dc2626', '#16a34a'].map(color => (
                                    <button 
                                        key={color}
                                        onClick={() => setPenColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform ${penColor === color ? 'border-gray-900 scale-110 shadow-sm' : 'border-gray-200'}`}
                                        style={{backgroundColor: color}}
                                        title={`Mudar cor`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>

        {/* --- ÁREA DA FOLHA --- */}
        <main className={`flex-1 p-4 md:p-8 overflow-y-auto print:p-0 print:bg-white print:overflow-visible touch-pan-y transition-colors duration-500 ${isDigitalMode ? 'bg-indigo-100/50' : 'bg-gray-200'}`}>
            
            <div className={`sheet-container relative max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] p-[10mm] md:p-[15mm] print:shadow-none print:w-full print:max-w-none transition-all duration-300 ${isDigitalMode ? 'ring-4 ring-indigo-400 ring-offset-4 cursor-crosshair' : ''}`}>
            
            {/* CANVAS DE DESENHO (Camada Superior) */}
            {isDigitalMode && (
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-50 touch-none"
                    style={{backgroundColor: 'transparent'}}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            )}

            {/* CABEÇALHO */}
            <header className="border-b-2 border-gray-800 pb-4 mb-8 flex justify-between items-end select-none">
                <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Caderno de Caligrafia</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Estilo: <span className="font-bold text-indigo-900 uppercase">{styles.find(s => s.id === activeStyle)?.name}</span>
                    </p>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-xs text-gray-400">Data: ____/____/________</div>
                    <div className="text-xs text-gray-400 mt-1">Nome: __________________________</div>
                </div>
            </header>

            {/* INSTRUÇÕES */}
            <div className={`mb-6 p-3 rounded text-sm print:hidden transition-colors ${isDigitalMode ? 'bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium' : 'bg-gray-50 text-gray-600'}`}>
                {isDigitalMode ? (
                    <div className="flex items-center gap-2">
                        <IconPenTool size={16}/> 
                        <span><strong>Pronto para escrever!</strong> As linhas estão demarcadas em azul para facilitar.</span>
                    </div>
                ) : (
                    <div><strong>Instrução:</strong> Imprima esta folha ou ative o Modo Digital na barra lateral.</div>
                )}
            </div>

            {/* EXERCÍCIOS */}
            <div className="space-y-2 select-none">
                {renderExerciseRows()}
            </div>

            <footer className="mt-12 text-center text-xs text-gray-400 border-t pt-4 select-none">
                Pratique diariamente. A constância define a excelência.
            </footer>

            </div>
        </main>
        </div>
    );
};

// Renderização
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CalligraphyApp />);
