'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Undo2, Redo2, Trash2 } from 'lucide-react'

export default function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(2)
  const [isDrawing, setIsDrawing] = useState(false)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  
  // 添加历史记录状态
  const [history, setHistory] = useState<ImageData[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth * 0.7
    canvas.height = window.innerHeight * 0.8

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'

    // 初始化历史记录
    const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setHistory([initialState])
    setCurrentStep(0)

    // Cleanup function for media stream
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [color, brushSize])

  const saveState = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 获取当前画布状态
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    // 如果不是撤销/重做操作，则需要清除当前步骤之后的历史记录
    if (!isUndoRedoAction) {
      const newHistory = history.slice(0, currentStep + 1)
      setHistory([...newHistory, currentState])
      setCurrentStep(currentStep + 1)
    }
    setIsUndoRedoAction(false)
  }

  const undo = () => {
    if (currentStep > 0) {
      setIsUndoRedoAction(true)
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const newStep = currentStep - 1
      ctx.putImageData(history[newStep], 0, 0)
      setCurrentStep(newStep)
    }
  }

  const redo = () => {
    if (currentStep < history.length - 1) {
      setIsUndoRedoAction(true)
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const newStep = currentStep + 1
      ctx.putImageData(history[newStep], 0, 0)
      setCurrentStep(newStep)
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveState()
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 清除画布后保存状态
    saveState()
  }

  const startRecording = async () => {
    try {
      // Request screen capture permission and get the media stream
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
        },
        audio: true,
      });
      
      mediaStreamRef.current = stream

      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'tab-recording.webm'
        a.click()
        URL.revokeObjectURL(url)
        
        // Stop all tracks when recording is complete
        stream.getTracks().forEach(track => track.stop());
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (err) {
      console.error('Error starting screen recording:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
      
      // Stop all tracks in the media stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
        mediaStreamRef.current = null
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Canvas</h2>
        <p className="text-muted-foreground">
          Draw and record your canvas content
        </p>
      </div>

      <Card>
        <div className="flex">
          {/* Left side - Canvas */}
          <div className="flex-1 bg-white">
            <canvas
              ref={canvasRef}
              className="w-full h-[calc(100vh-13rem)]"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>

          {/* Right side - Tools */}
          <div className="w-48 border-l border-gray-200 bg-white p-3">
            <h2 className="text-lg font-bold mb-4">Tools</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brush Size</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-1"
                  onClick={undo}
                  disabled={currentStep <= 0}
                  title="Undo"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-1"
                  onClick={redo}
                  disabled={currentStep >= history.length - 1}
                  title="Redo"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={clearCanvas}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Canvas
              </Button>

              <Button
                className="w-full"
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
