// Extrae texto de un archivo subido (.txt, .md, .docx, .pdf).
// Optimización: mammoth (docx) y pdf.js (pdf) se cargan SOLO cuando se necesitan (dynamic import),
// para que la página de Roblox cargue ligera y no arrastre esas librerías pesadas de entrada.

export async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith('.txt') || name.endsWith('.md')) {
    return file.text();
  }

  if (name.endsWith('.docx')) {
    const mammoth = (await import('mammoth')).default;
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (name.endsWith('.pdf')) {
    const pdfjs = await import('pdfjs-dist');
    // @ts-expect-error: import del worker como URL (resuelto por Vite en build)
    const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default as string;
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    const data = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data }).promise;
    let text = '';
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      text += content.items.map((it) => ('str' in it ? it.str : '')).join(' ') + '\n';
    }
    return text;
  }

  // Fallback: intenta leerlo como texto plano.
  return file.text();
}
