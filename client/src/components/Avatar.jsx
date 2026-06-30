const PALETTE = [
    ['#0ea5b7', '#0d1b2a'],
    ['#7c3aed', '#1a1033'],
    ['#db2777', '#2a0f1d'],
    ['#16a34a', '#0a1f12'],
    ['#ea580c', '#241008'],
    ['#2563eb', '#0c1530'],
];

function colorsFor(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return PALETTE[hash % PALETTE.length];
}

function initialsFor(name) {
    const parts = name.trim().split(/[\s_-]+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function Avatar({ name = '', size = 36, ring = false }) {
    const [fg, bg] = colorsFor(name || '?');
    return (
        <div
            className={`flex items-center justify-center rounded-full font-semibold flex-shrink-0 ${ring ? 'ring-2 ring-[#00dbe9]/60' : ''
                }`}
            style={{
                width: size,
                height: size,
                background: bg,
                color: fg,
                fontSize: size * 0.38,
                border: `1px solid ${fg}55`,
            }}
        >
            {initialsFor(name)}
        </div>
    );
}
