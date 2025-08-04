import React, { useCallback, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
  Connection,
  OnConnect,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { mockMachines } from "@/data/mockData";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function MachinesToolbar({ 
  reactFlowWrapper,
  setNodes
}: { 
  reactFlowWrapper: React.RefObject<HTMLDivElement>,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 200;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    checkScrollPosition(); // Initial check
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, []);

  return (
    <div className="relative w-full border-b bg-muted p-2">
      <div className="flex flex-col space-y-1">
        <h2 className="text-sm font-medium text-gray-500 px-2 mb-4">Maschinen</h2>
        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="m-1 h-5 w-5 text-gray-600" />
            </button>
          )}
          
          <div
            ref={scrollContainerRef}
            className="flex space-x-2 pb-1 overflow-x-auto scrollbar-hide"
            onScroll={checkScrollPosition}
          >
            {mockMachines.map((machine) => (
            <div
                key={machine.id}
                className="flex-shrink-0 flex items-center cursor-grab active:cursor-grabbing rounded-lg border border-gray-200 px-3 py-2 bg-white hover:bg-blue-50 transition-colors shadow-xs"
                style={{ touchAction: 'none' }} 
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData(
                    "application/reactflow",
                    JSON.stringify(machine)
                  );
                  event.dataTransfer.effectAllowed = "move";
                }}
                onTouchStart={(e) => {
                  if (window.innerWidth >= 768) return;
                  
                  if (e.cancelable) {
                    e.preventDefault();
                  }
                  
                  if (!reactFlowWrapper.current) return;
                  const wrapperRect = reactFlowWrapper.current.getBoundingClientRect();
                  const centerX = wrapperRect.width / 2;
                  const centerY = wrapperRect.height / 2;
                  
                  const newNode: Node = {
                    id: `${machine.id}-${+new Date()}`,
                    type: "default",
                    position: {
                      x: centerX,
                      y: centerY
                    },
                    data: { label: machine.name, machineData: machine },
                    style: {
                      background: "#2563eb",
                      color: "#fff",
                      padding: 10,
                      borderRadius: 5,
                      fontWeight: "bold",
                      textAlign: "center",
                      cursor: "move",
                    },
                  };

                  setNodes((nds) => nds.concat(newNode));
                }}
              >
                <span className="text-sm whitespace-nowrap">{machine.name}</span>
              </div>
            ))}
          </div>

          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="m-1 h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FlowEditorInner() {
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [contextMenuNode, setContextMenuNode] = useState<Node | null>(null);
  const [confirmDeleteNode, setConfirmDeleteNode] = useState<Node | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const { project } = useReactFlow();
  const [edgeToDelete, setEdgeToDelete] = useState<Edge | null>(null);
  const [popupNode, setPopupNode] = useState<Node | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const lastTap = useRef(0);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      event.stopPropagation();
      if (!reactFlowWrapper.current) return;

      const wrapperRect = reactFlowWrapper.current.getBoundingClientRect();
      let x = event.clientX - wrapperRect.left;
      let y = event.clientY - wrapperRect.top;

      if (x + 150 > wrapperRect.width) x = wrapperRect.width - 150;
      if (y + 90 > wrapperRect.height) y = wrapperRect.height - 90;
      if (x < 0) x = 0;
      if (y < 0) y = 0;

      setContextMenuPos({ x, y });
      setContextMenuNode(node);
    },
    []
  );

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect: OnConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const onSelectionChange = useCallback(({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
    setSelectedNodes(nodes);
    setSelectedEdges(edges);
  }, []);

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setEdgeToDelete(edge);
    },
    []
  );

  const onTouchStartNode = (event: React.TouchEvent, node: Node) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap.current;

    if (tapLength < 400 && tapLength > 0) {
      if (!event.touches || event.touches.length === 0) return;

      const touch = event.touches[0];

      const simulatedMouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as unknown as React.MouseEvent;

      onNodeDoubleClick(simulatedMouseEvent, node);
    }
    lastTap.current = currentTime;
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData("application/reactflow");
      if (!rawData || !reactFlowWrapper.current) return;

      let machine;
      try {
        machine = JSON.parse(rawData);
      } catch {
        return;
      }

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node = {
        id: `${machine.id}-${+new Date()}`,
        type: "default",
        position,
        data: { label: machine.name, machineData: machine },
        style: {
          background: "#2563eb",
          color: "#fff",
          padding: 10,
          borderRadius: 5,
          fontWeight: "bold",
          textAlign: "center",
          cursor: "move",
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const POPUP_WIDTH = 280;
  const POPUP_HEIGHT = 160;

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation();
      if (!reactFlowWrapper.current) return;

      const wrapperRect = reactFlowWrapper.current.getBoundingClientRect();
      let x = event.clientX - wrapperRect.left;
      let y = event.clientY - wrapperRect.top;

      if (x + POPUP_WIDTH > wrapperRect.width) x = wrapperRect.width - POPUP_WIDTH - 10;
      if (y + POPUP_HEIGHT > wrapperRect.height) y = wrapperRect.height - POPUP_HEIGHT - 10;
      if (x < 10) x = 10;
      if (y < 10) y = 10;

      setPopupPos({ x, y });
      setPopupNode(node);
    },
    []
  );

  useEffect(() => {
    const storedNodes = localStorage.getItem("flow-nodes");
    const storedEdges = localStorage.getItem("flow-edges");
    if (storedNodes) setNodes(JSON.parse(storedNodes));
    if (storedEdges) setEdges(JSON.parse(storedEdges));
  }, []);

  useEffect(() => {
    localStorage.setItem("flow-nodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem("flow-edges", JSON.stringify(edges));
  }, [edges]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!reactFlowWrapper.current) return;
      const wrapper = reactFlowWrapper.current;
      
      if (!wrapper.contains(event.target as Node & ParentNode)) {
        setPopupNode(null);
        setPopupPos(null);
        setContextMenuNode(null);
        setContextMenuPos(null);
        return;
      }

      const popupEl = document.getElementById("machine-popup");
      if (popupEl && !popupEl.contains(event.target as Node & ParentNode)) {
        setPopupNode(null);
        setPopupPos(null);
      }

      if (contextMenuPos) {
        setContextMenuNode(null);
        setContextMenuPos(null);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [popupNode, contextMenuPos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        setNodes((nds) => nds.filter((n) => !selectedNodes.some((s) => s.id === n.id)));
        setEdges((eds) => eds.filter((e) => !selectedEdges.some((s) => s.id === e.id)));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodes, selectedEdges]);

  return (
    <div className="flex flex-col h-[600px] border rounded-md overflow-hidden relative max-w-[100vw]">
      <button
        onClick={() => setConfirmClearAll(true)}
        className="absolute top-2 right-2 z-[10] bg-red-600 text-white px-2 py-1 text-sm rounded hover:bg-red-700"
      >
        Alles löschen
      </button>

      <MachinesToolbar reactFlowWrapper={reactFlowWrapper} setNodes={setNodes} />

      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          onNodeDoubleClick={onNodeDoubleClick}
          onSelectionChange={onSelectionChange}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeClick={onEdgeClick}
          onNodeClick={(e, node) => {
            if ("ontouchstart" in window) {
              onTouchStartNode(e as unknown as React.TouchEvent, node);
            }
          }}
          onTouchStart={(e) => {
            if (window.innerWidth < 768 && e.cancelable) {
              e.preventDefault();
            }
          }}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {/* Confirmation Dialogs */}
        {confirmClearAll && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[11000]">
            <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
              <h3 className="mb-4">Alle Maschinen wirklich löschen?</h3>
              <div className="flex justify-end gap-3">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    setNodes([]);
                    setEdges([]);
                    setPopupNode(null);
                    setPopupPos(null);
                    setConfirmClearAll(false);
                  }}
                >
                  Löschen
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setConfirmClearAll(false)}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        {contextMenuPos && contextMenuNode && (
          <div
            className="absolute bg-white border border-gray-200 rounded shadow-lg z-[10000] w-[140px]"
            style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100"
              onClick={() => {
                setConfirmDeleteNode(contextMenuNode);
                setContextMenuNode(null);
                setContextMenuPos(null);
              }}
            >
              Maschine löschen
            </button>
          </div>
        )}

        {confirmDeleteNode && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[11000]">
            <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
              <h3 className="mb-4">Maschine wirklich löschen?</h3>
              <div className="flex justify-end gap-3">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    if (!confirmDeleteNode) return;
                    setNodes((nds) => nds.filter((n) => n.id !== confirmDeleteNode.id));
                    setEdges((eds) =>
                      eds.filter((e) => e.source !== confirmDeleteNode.id && e.target !== confirmDeleteNode.id)
                    );
                    if (popupNode?.id === confirmDeleteNode.id) {
                      setPopupNode(null);
                      setPopupPos(null);
                    }
                    setConfirmDeleteNode(null);
                  }}
                >
                  Löschen
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setConfirmDeleteNode(null)}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        {edgeToDelete && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[11000]">
            <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
              <h3 className="mb-4">Linie wirklich löschen?</h3>
              <div className="flex justify-end gap-3">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    if (!edgeToDelete) return;
                    setEdges((eds) => eds.filter((e) => e.id !== edgeToDelete.id));
                    setEdgeToDelete(null);
                  }}
                >
                  Löschen
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setEdgeToDelete(null)}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        {popupNode && popupPos && (
          <div
            id="machine-popup"
            className="absolute bg-white rounded-lg shadow-xl z-[999] flex flex-col"
            style={{
              left: popupPos.x,
              top: popupPos.y,
              width: POPUP_WIDTH,
              maxHeight: POPUP_HEIGHT,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-3 border-b flex justify-between items-center">
              <strong>Maschine Details</strong>
              <button
                onClick={() => setPopupNode(null)}
                className="text-xl leading-none hover:text-gray-600"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto p-3" style={{ maxHeight: POPUP_HEIGHT - 50 }}>
              {popupNode.data.machineData ? (
                Object.entries(popupNode.data.machineData)
                  .filter(([key]) => key !== "position" && key !== "components")
                  .map(([key, value]) => (
                    <p key={key} className="mb-1">
                      <strong>{key}:</strong> {String(value)}
                    </p>
                  ))
              ) : (
                <p>Keine Maschinendaten verfügbar</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Editor() {
  return (
<div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 max-w-[100vw] overflow-x-hidden">

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-primary" />
            Maschinen-Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReactFlowProvider>
            <FlowEditorInner />
          </ReactFlowProvider>
        </CardContent>
      </Card>
    </div>
  );
}