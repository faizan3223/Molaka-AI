import { Artifact } from '../types';

/**
 * Extracts code blocks from markdown text and identifies them as live Claude Artifacts
 */
export function extractArtifacts(text: string): Artifact[] {
  const artifacts: Artifact[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_\-+]*)\s*([\s\S]*?)```/g;
  let match;
  let index = 1;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const rawLang = (match[1] || 'generic').toLowerCase().trim();
    const code = match[2].trim();

    if (!code) continue;

    let type: Artifact['type'] = 'generic';
    let title = `Artifact ${index}`;

    if (rawLang === 'html' || code.includes('<!DOCTYPE') || (code.includes('<html') && code.includes('</html>'))) {
      type = 'html';
      title = extractTitleFromCode(code) || 'Interactive Web Application';
    } else if (rawLang === 'tsx' || rawLang === 'jsx' || code.includes('import React') || code.includes('export default function')) {
      type = 'react';
      title = extractTitleFromCode(code) || 'React Interactive Component';
    } else if (rawLang === 'svg' || (code.startsWith('<svg') && code.includes('</svg>'))) {
      type = 'svg';
      title = extractTitleFromCode(code) || 'SVG Vector Illustration';
    } else if (rawLang === 'javascript' || rawLang === 'js') {
      type = 'javascript';
      title = extractTitleFromCode(code) || 'JavaScript Script';
    } else if (rawLang === 'python' || rawLang === 'py') {
      type = 'python';
      title = extractTitleFromCode(code) || 'Python Program';
    } else if (rawLang === 'css') {
      type = 'css';
      title = 'Custom Stylesheet';
    } else if (rawLang === 'json') {
      type = 'json';
      title = 'Data Structure (JSON)';
    } else if (rawLang === 'markdown' || rawLang === 'md') {
      type = 'markdown';
      title = 'Formatted Document';
    }

    // Only qualify as interactive artifact if length is substantial or type is previewable
    if (['html', 'react', 'svg', 'javascript', 'python'].includes(type) || code.length > 80) {
      artifacts.push({
        id: `artifact-${index}-${Date.now()}`,
        title,
        type,
        language: rawLang || 'code',
        code,
        version: 1,
      });
      index++;
    }
  }

  return artifacts;
}

function extractTitleFromCode(code: string): string | null {
  // Check for comment title e.g. <!-- Title: My Game --> or // Title: My Component
  const commentMatch = code.match(/(?:\/\/|<!--|\/\*)\s*(?:title|app|name):\s*([^\r\n*>-]+)/i);
  if (commentMatch && commentMatch[1]) {
    return commentMatch[1].trim();
  }
  // Check for <title> tag in HTML
  const titleTagMatch = code.match(/<title>([^<]+)<\/title>/i);
  if (titleTagMatch && titleTagMatch[1]) {
    return titleTagMatch[1].trim();
  }
  return null;
}

/**
 * Builds a runnable HTML bundle for the sandboxed iframe
 */
export function buildExecutableHtml(artifact: Artifact): string {
  const { code, type } = artifact;

  if (type === 'svg') {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #faf9f6; }
    svg { max-width: 90vw; max-height: 90vh; }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
  }

  if (type === 'html') {
    // If it's already a full HTML document, inject Tailwind & Lucide & Babel if needed
    if (code.includes('<html') || code.includes('<!DOCTYPE')) {
      return code.replace(
        '</head>',
        `<script src="https://cdn.tailwindcss.com"></script>
         <link rel="preconnect" href="https://fonts.googleapis.com">
         <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
         <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
         <script src="https://unpkg.com/lucide@latest"></script>
         <script>window.addEventListener('DOMContentLoaded', () => { if (window.lucide) lucide.createIcons(); });</script>
         </head>`
      );
    }
    // Otherwise wrap snippet
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 1.5rem; background: #ffffff; color: #1e1e1e; }
  </style>
</head>
<body>
  ${code}
  <script>
    if (window.lucide) lucide.createIcons();
  </script>
</body>
</html>`;
  }

  if (type === 'react') {
    // Transform react code to render in browser via Babel Standalone
    // Strip import / export statements for browser standalone compatibility
    let cleanCode = code
      .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
      .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/g, 'function $1')
      .replace(/export\s+default\s+([A-Za-z0-9_]+);?/g, 'window.__MainComponent = $1;')
      .replace(/export\s+/g, '');

    // If main function defined without export default
    const funcMatch = code.match(/function\s+([A-Z][A-Za-z0-9_]*)/);
    const componentName = funcMatch ? funcMatch[1] : 'App';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 1rem; background: #ffffff; color: #1e1e1e; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback } = React;
    
    try {
      ${cleanCode}

      const TargetComponent = window.__MainComponent || (typeof ${componentName} !== 'undefined' ? ${componentName} : null);
      if (TargetComponent) {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(TargetComponent));
      } else {
        document.getElementById('root').innerHTML = '<div class="p-6 text-amber-800 bg-amber-50 rounded-xl border border-amber-200">React component compiled, but could not find root component export.</div>';
      }
    } catch (err) {
      document.getElementById('root').innerHTML = '<div class="p-4 bg-red-50 text-red-700 rounded-lg font-mono text-sm border border-red-200"><strong>Runtime Error:</strong><br>' + err.message + '</div>';
    }
  </script>
</body>
</html>`;
  }

  // Generic or JS/Python fallback display
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; padding: 2rem; background: #1e1e1e; color: #d4d4d4; }
    pre { white-space: pre-wrap; font-size: 13px; line-height: 1.6; }
  </style>
</head>
<body>
  <pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
</body>
</html>`;
}
