importScripts("https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.js");
let runtimePromise;
onmessage = async (event) => {
  let output = "";
  try {
    runtimePromise ||= loadPyodide();
    const pyodide = await runtimePromise;
    pyodide.setStdout({ batched: (line) => { output += `${line}\n`; } });
    await pyodide.runPythonAsync(event.data.code);
    postMessage({ ok: true, output: output.replace(/\n$/, "") });
  } catch (error) {
    postMessage({ ok: false, error: String(error) });
  }
};
