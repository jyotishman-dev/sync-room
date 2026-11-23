"use client"


import React, { useRef, useState } from 'react'

const Home = () => {

  const wsRef = useRef<WebSocket | null>(null)
  const [log, setLog] = useState<string[]>([])

const addLog = (line: string) =>
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()}  ${line}`]);



  const connect = ()=>{
    if (wsRef.current) return;

    const ws = new WebSocket("ws://localhost:3001");

    wsRef.current = ws

  ws.onopen = () => addLog("CONNECTED (onopen fired)");
    ws.onmessage = (e) => addLog(`RECV: ${e.data}`);
    ws.onclose = (e) => {
      addLog(`CLOSED code=${e.code}`);
      wsRef.current = null;
    };
    ws.onerror = () => addLog("ERROR");
  }


  const disconnect = () => wsRef.current?.close();

const sendPing = () => {
    wsRef.current?.send(JSON.stringify({ type: "client:ping", data: "hello from Next.js" }));
    addLog('SENT: {"type":"client:ping"}');
  };

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", fontFamily: "monospace", padding: 16 }}>
      <h1>SyncRoom — phase 00</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={connect}>Connect</button>
        <button onClick={sendPing}>Send ping</button>
        <button onClick={disconnect}>Disconnect</button>
      </div>
      <pre style={{ background: "#111", color: "#0f0", padding: 12, minHeight: 200 }}>
        {log.join("\n")}
      </pre>
    </main>
  )
}

export default Home