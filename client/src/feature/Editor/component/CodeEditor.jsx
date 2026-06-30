import { useMemo, useRef } from 'react';

const KEYWORDS = new Set([
    'const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for',
    'while', 'import', 'from', 'export', 'default', 'new', 'class', 'extends', 'this',
    'true', 'false', 'null', 'undefined', 'typeof', 'instanceof', 'of', 'in', 'try',
    'catch', 'finally', 'throw', 'switch', 'case', 'break', 'continue', 'do', 'yield',
    'static', 'get', 'set', 'super', 'void', 'delete',
]);

const TOKEN_REGEX =
    /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+\.?\d*\b)|([A-Za-z_$][\w$]*)/g;

function highlight(code) {
    const nodes = [];
    let lastIndex = 0;
    let key = 0;
    let match;
    TOKEN_REGEX.lastIndex = 0;

    while ((match = TOKEN_REGEX.exec(code))) {
        const [full, comment, block, string, number, ident] = match;
        if (match.index > lastIndex) nodes.push(code.slice(lastIndex, match.index));

        if (comment || block) {
            nodes.push(<span key={key++} className="text-gray-500 italic">{full}</span>);
        } else if (string) {
            nodes.push(<span key={key++} className="text-[#a5d6ff]">{full}</span>);
        } else if (number) {
            nodes.push(<span key={key++} className="text-[#79c0ff]">{full}</span>);
        } else if (ident) {
            if (KEYWORDS.has(ident)) {
                nodes.push(<span key={key++} className="text-[#ff7b72]">{full}</span>);
            } else if (code[TOKEN_REGEX.lastIndex] === '(') {
                nodes.push(<span key={key++} className="text-[#d2a8ff]">{full}</span>);
            } else if (/^[A-Z]/.test(ident)) {
                nodes.push(<span key={key++} className="text-[#00dbe9]">{full}</span>);
            } else {
                nodes.push(full);
            }
        }
        lastIndex = TOKEN_REGEX.lastIndex;
    }
    if (lastIndex < code.length) nodes.push(code.slice(lastIndex));
    return nodes;
}

const FONT_CLASS = 'font-mono text-[13px] leading-[1.7]';

export default function CodeEditor({ value, onChange, textareaRef, placeholder }) {
    const gutterRef = useRef(null);
    const preRef = useRef(null);
    const localTextareaRef = useRef(null);
    const taRef = textareaRef || localTextareaRef;

    const lineCount = Math.max(1, value.split('\n').length);
    const lineNumbers = useMemo(
        () => Array.from({ length: lineCount }, (_, i) => i + 1),
        [lineCount]
    );
    const highlighted = useMemo(() => highlight(value || ''), [value]);

    function handleScroll(e) {
        const { scrollTop, scrollLeft } = e.target;
        if (gutterRef.current) gutterRef.current.scrollTop = scrollTop;
        if (preRef.current) {
            preRef.current.scrollTop = scrollTop;
            preRef.current.scrollLeft = scrollLeft;
        }
    }

    return (
        <div className="flex flex-1 min-h-0 bg-[#05080c]">
            <div
                ref={gutterRef}
                className={`${FONT_CLASS} select-none text-right text-gray-600 py-4 pl-4 pr-3 overflow-hidden bg-[#070a0f] border-r border-[#1c232c]`}
                style={{ minWidth: `${String(lineCount).length * 8 + 32}px` }}
            >
                {lineNumbers.map((n) => (
                    <div key={n}>{n}</div>
                ))}
            </div>

            <div className="relative flex-1 overflow-hidden">
                <pre
                    ref={preRef}
                    aria-hidden="true"
                    className={`${FONT_CLASS} absolute inset-0 m-0 py-4 px-4 overflow-hidden whitespace-pre text-gray-300 pointer-events-none`}
                >
                    {highlighted}
                    {'\n'}
                </pre>
                <textarea
                    ref={taRef}
                    value={value}
                    onChange={onChange}
                    onScroll={handleScroll}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    placeholder={placeholder}
                    className={`${FONT_CLASS} absolute inset-0 w-full h-full resize-none outline-none bg-transparent text-transparent caret-[#00dbe9] py-4 px-4 whitespace-pre overflow-auto`}
                />
            </div>
        </div>
    );
}
