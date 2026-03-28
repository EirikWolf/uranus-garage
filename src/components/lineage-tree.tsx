"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  Position,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

interface TreeNode {
  id: string;
  name: string;
  userName: string;
  userImage: string | null;
  parentId: string | null;
  avgRating: number | null;
  childCount: number;
}

function buildFlowElements(treeNodes: TreeNode[], focusId: string) {
  // Simple vertical layout: root at top, children below
  const nodeMap = new Map(treeNodes.map((n) => [n.id, n]));
  const childrenMap = new Map<string, string[]>();

  for (const n of treeNodes) {
    if (n.parentId && nodeMap.has(n.parentId)) {
      const siblings = childrenMap.get(n.parentId) || [];
      siblings.push(n.id);
      childrenMap.set(n.parentId, siblings);
    }
  }

  // Find root (node without parent in our set)
  const root = treeNodes.find((n) => !n.parentId || !nodeMap.has(n.parentId));
  if (!root) return { nodes: [], edges: [] };

  const flowNodes: Node[] = [];
  const flowEdges: Edge[] = [];
  const levelWidth = 250;
  const levelHeight = 120;

  function layout(nodeId: string, x: number, y: number, level: number): number {
    const node = nodeMap.get(nodeId);
    if (!node) return x;

    const isFocus = nodeId === focusId;

    flowNodes.push({
      id: nodeId,
      position: { x, y },
      data: {
        label: node.name,
        userName: node.userName,
        avgRating: node.avgRating,
        isFocus,
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      style: {
        background: isFocus ? "#dd3333" : "#2d2d2d",
        color: "#f5f5f5",
        border: isFocus ? "2px solid #dd3333" : "1px solid #444",
        borderRadius: "8px",
        padding: "12px 16px",
        fontSize: "13px",
        minWidth: "180px",
        textAlign: "center" as const,
      },
    });

    const children = childrenMap.get(nodeId) || [];
    if (children.length === 0) return x;

    const totalWidth = children.length * levelWidth;
    let childX = x - totalWidth / 2 + levelWidth / 2;

    for (const childId of children) {
      flowEdges.push({
        id: `${nodeId}-${childId}`,
        source: nodeId,
        target: childId,
        style: { stroke: "#555" },
        animated: childId === focusId,
      });

      childX = layout(childId, childX, y + levelHeight, level + 1);
      childX += levelWidth;
    }

    return x;
  }

  layout(root.id, 400, 50, 0);
  return { nodes: flowNodes, edges: flowEdges };
}

function CustomNodeLabel({ data }: { data: { label: string; userName: string; avgRating: number | null; isFocus: boolean } }) {
  return (
    <div>
      <div className="font-semibold text-sm">{data.label}</div>
      <div className="text-xs opacity-70">{data.userName}</div>
      {data.avgRating && (
        <div className="text-xs mt-1 flex items-center justify-center gap-0.5">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {data.avgRating}
        </div>
      )}
    </div>
  );
}

export function LineageTree({ forkId }: { forkId: string }) {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTree() {
      try {
        const res = await fetch(`/api/forks/${forkId}/lineage`);
        if (!res.ok) return;
        const data = await res.json();
        const { nodes: flowNodes, edges: flowEdges } = buildFlowElements(data.nodes, data.focusId);
        setNodes(flowNodes);
        setEdges(flowEdges);
      } finally {
        setLoading(false);
      }
    }
    fetchTree();
  }, [forkId, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: unknown, node: Node) => {
      if (node.id !== forkId) {
        router.push(`/forks/${node.id}`);
      }
    },
    [forkId, router],
  );

  if (loading) {
    return <div className="h-[500px] flex items-center justify-center text-muted-foreground">Laster slektstre...</div>;
  }

  if (nodes.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Ingen slektstre tilgjengelig.</div>;
  }

  return (
    <div className="h-[500px] rounded-lg border border-border overflow-hidden bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#333" gap={20} />
        <Controls
          style={{ background: "#2d2d2d", border: "1px solid #444", borderRadius: "8px" }}
        />
      </ReactFlow>
    </div>
  );
}
