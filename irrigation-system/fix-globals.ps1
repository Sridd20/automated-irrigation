# Run this script from inside:
# C:\Projects\automated-irrigation\irrigation-system\
# Command: powershell -ExecutionPolicy Bypass -File fix-globals.ps1

$cssContent = @'
@import "tailwindcss";
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&display=swap");

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
  @keyframes water-rise {
    from { transform: scaleY(0); }
    to { transform: scaleY(1); }
  }
}

:root {
  --background: #f8f9f7;
  --foreground: #0f1a14;
  --card: #ffffff;
  --card-foreground: #0f1a14;
  --primary: #2d7a4f;
  --primary-light: #4a9e6b;
  --primary-foreground: #ffffff;
  --secondary: #f0f5f2;
  --secondary-foreground: #0f1a14;
  --muted: #f0f5f2;
  --muted-foreground: #6b7c72;
  --accent: #e8f5ee;
  --accent-foreground: #2d7a4f;
  --destructive: #d63b3b;
  --destructive-foreground: #ffffff;
  --border: #e2ebe5;
  --input: #e2ebe5;
  --ring: #2d7a4f;
  --radius: 0.75rem;
  --nav-bg: #ffffff;
  --nav-height: 64px;
  --amber: #d97706;
  --amber-bg: #fffbeb;
  --blue: #2563eb;
  --blue-bg: #eff6ff;
}

* {
  box-sizing: border-box;
}

html {
  font-family: "DM Sans", sans-serif;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: "DM Sans", sans-serif;
  font-feature-settings: "rlig" 1, "calt" 1;
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
}

.font-display {
  font-family: "DM Serif Display", serif;
}

.ease-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.ease-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.ease-card-elevated {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07), 0 1px 4px rgba(0, 0, 0, 0.04);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--muted-foreground);
  transition: all 0.15s ease;
  text-decoration: none;
}

.nav-link:hover {
  background: var(--muted);
  color: var(--foreground);
}

.nav-link.active {
  background: var(--accent);
  color: var(--primary);
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  animation: pulse-dot 2s infinite;
}

.ease-input {
  width: 100%;
  padding: 10px 14px;
  background: var(--background);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: "DM Sans", sans-serif;
  color: var(--foreground);
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}

.ease-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(45, 122, 79, 0.12);
}

.ease-input::placeholder {
  color: var(--muted-foreground);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 22px;
  background: var(--primary);
  color: var(--primary-foreground);
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: "DM Sans", sans-serif;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(45, 122, 79, 0.25);
}

.btn-primary:hover:not(:disabled) {
  background: #256841;
  box-shadow: 0 4px 12px rgba(45, 122, 79, 0.3);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 22px;
  background: var(--secondary);
  color: var(--foreground);
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: "DM Sans", sans-serif;
  cursor: pointer;
  border: 1px solid var(--border);
  transition: all 0.15s ease;
}

.btn-secondary:hover {
  background: var(--muted);
  border-color: var(--primary);
  color: var(--primary);
}

.ease-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.badge-green {
  background: var(--accent);
  color: var(--primary);
}

.badge-amber {
  background: var(--amber-bg);
  color: var(--amber);
}

.badge-blue {
  background: var(--blue-bg);
  color: var(--blue);
}

.stat-block {
  padding: 20px 24px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
}

.section-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted-foreground);
}

.animate-in {
  animation: fade-in 0.45s ease-out forwards;
}

.delay-100 { animation-delay: 0.1s; opacity: 0; }
.delay-200 { animation-delay: 0.2s; opacity: 0; }
.delay-300 { animation-delay: 0.3s; opacity: 0; }

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 10px;
  background: var(--border);
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(45, 122, 79, 0.4);
}
'@

$targetPath = ".\src\app\globals.css"

# Force delete and rewrite
Remove-Item -Path $targetPath -Force -ErrorAction SilentlyContinue
[System.IO.File]::WriteAllText((Resolve-Path ".\src\app").Path + "\globals.css", $cssContent, [System.Text.Encoding]::UTF8)

Write-Host "✅ globals.css fixed successfully!" -ForegroundColor Green
Write-Host "Line count: $((Get-Content $targetPath).Count)" -ForegroundColor Cyan
Write-Host "Now run: npm run dev" -ForegroundColor Yellow
