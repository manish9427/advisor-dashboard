'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

// Generate a synthetic graph to match the visual density of the screenshot
const generateGraphData = () => {
  const nodes: any[] = [];
  const links: any[] = [];

  // 1. RM Node (Center)
  nodes.push({ id: 'rm1', name: 'RM', val: 30, color: '#f59e0b', type: 'rm' });

  // 2. Clients & Holdings
  const clients = [
    { id: 'c1', name: 'VK', val: 15, color: '#8b5cf6', type: 'client' },
    { id: 'c2', name: 'RM', val: 12, color: '#8b5cf6', type: 'client' },
    { id: 'c3', name: 'AS', val: 10, color: '#8b5cf6', type: 'client' },
    { id: 'c4', name: 'PV', val: 14, color: '#8b5cf6', type: 'client' },
    { id: 'c5', name: 'NK', val: 8, color: '#8b5cf6', type: 'client' },
  ];

  clients.forEach((client) => {
    nodes.push(client);
    links.push({ source: 'rm1', target: client.id, color: '#475569' });

    // Add 2-4 holdings per client
    const numHoldings = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numHoldings; i++) {
      const holdingId = `${client.id}-h${i}`;
      const isEquity = Math.random() > 0.5;
      const isDebt = !isEquity && Math.random() > 0.5;
      
      nodes.push({
        id: holdingId,
        name: `H${i}`,
        val: Math.random() * 5 + 2,
        color: isEquity ? '#ec4899' : isDebt ? '#3b82f6' : '#eab308', // Pink, Blue, Yellow
        type: 'holding'
      });
      links.push({ source: client.id, target: holdingId, color: '#334155' });
    }
  });

  return { nodes, links };
};

export default function NetworkGraph() {
  const fgRef = useRef<any>(null);
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    setData(generateGraphData());
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(8, 2000);
    }
  }, []);

  return (
    <div className="w-full h-[500px] bg-[#0f172a] rounded-xl overflow-hidden relative border border-slate-800">
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        nodeLabel="name"
        nodeColor="color"
        nodeVal="val"
        linkColor="color"
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={handleNodeClick}
        backgroundColor="#0f172a"
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        cooldownTicks={100}
      />
      <div className="absolute bottom-4 left-4 flex gap-4 text-xs text-slate-300 bg-slate-900/80 p-2 rounded backdrop-blur-sm border border-slate-700">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span> RM (Gold)</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#8b5cf6]"></span> Equity (Purple)</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span> Debt (Blue)</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#ec4899]"></span> Alerts (Red)</div>
      </div>
    </div>
  );
}