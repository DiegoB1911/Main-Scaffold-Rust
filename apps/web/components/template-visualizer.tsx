"use client"

import { useEffect, useRef } from "react"

interface TemplateVisualizerProps {
  templateId: string
}

export function TemplateVisualizer({ templateId }: TemplateVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw the diagram based on template ID
    if (templateId === "marketplace") {
      drawMarketplaceDiagram(ctx, canvas.width, canvas.height)
    } else if (templateId === "dao") {
      drawDaoDiagram(ctx, canvas.width, canvas.height)
    } else {
      drawGenericDiagram(ctx, canvas.width, canvas.height)
    }

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current || !ctx) return

      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      // Redraw diagram
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (templateId === "marketplace") {
        drawMarketplaceDiagram(ctx, canvas.width, canvas.height)
      } else if (templateId === "dao") {
        drawDaoDiagram(ctx, canvas.width, canvas.height)
      } else {
        drawGenericDiagram(ctx, canvas.width, canvas.height)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [templateId])

  return (
    <div className="border rounded-md bg-muted p-4 h-[500px] flex flex-col">
      <h3 className="text-lg font-medium mb-4">Application Architecture</h3>
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  )
}

function drawMarketplaceDiagram(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const centerX = width / 2
  const centerY = height / 2

  // Define colors
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#0070f3"
  const mutedColor =
    getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim() || "#888888"
  const backgroundColor =
    getComputedStyle(document.documentElement).getPropertyValue("--background").trim() || "#ffffff"

  // Draw boxes for the architecture
  const boxWidth = 120
  const boxHeight = 60
  const boxSpacing = 40
  const boxRadius = 8

  // User Interface Layer
  ctx.beginPath()
  roundedRect(ctx, centerX - 250, centerY - 180, 500, 100, boxRadius)
  ctx.fillStyle = backgroundColor
  ctx.fill()
  ctx.strokeStyle = primaryColor
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.font = "16px sans-serif"
  ctx.fillStyle = mutedColor
  ctx.textAlign = "center"
  ctx.fillText("User Interface Layer", centerX, centerY - 150)

  // Draw UI components
  ctx.font = "12px sans-serif"
  ctx.fillText("Product Listings", centerX - 150, centerY - 130)
  ctx.fillText("User Profiles", centerX, centerY - 130)
  ctx.fillText("Bidding Interface", centerX + 150, centerY - 130)

  // Application Logic Layer
  ctx.beginPath()
  roundedRect(ctx, centerX - 250, centerY - 50, 500, 100, boxRadius)
  ctx.fillStyle = backgroundColor
  ctx.fill()
  ctx.strokeStyle = primaryColor
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.font = "16px sans-serif"
  ctx.fillText("Application Logic Layer", centerX, centerY - 20)

  // Draw logic components
  ctx.font = "12px sans-serif"
  ctx.fillText("Authentication", centerX - 150, centerY)
  ctx.fillText("State Management", centerX, centerY)
  ctx.fillText("API Integration", centerX + 150, centerY)

  // Smart Contract Layer
  ctx.beginPath()
  roundedRect(ctx, centerX - 250, centerY + 80, 500, 100, boxRadius)
  ctx.fillStyle = backgroundColor
  ctx.fill()
  ctx.strokeStyle = primaryColor
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.font = "16px sans-serif"
  ctx.fillText("Smart Contract Layer", centerX, centerY + 110)

  // Draw contract components
  ctx.font = "12px sans-serif"
  ctx.fillText("NFT Contract", centerX - 150, centerY + 130)
  ctx.fillText("Marketplace Contract", centerX, centerY + 130)
  ctx.fillText("Payment Contract", centerX + 150, centerY + 130)

  // Draw arrows
  drawArrow(ctx, centerX, centerY - 80, centerX, centerY - 50, primaryColor)
  drawArrow(ctx, centerX, centerY + 50, centerX, centerY + 80, primaryColor)

  // Draw title
  ctx.font = "18px sans-serif"
  ctx.fillStyle = mutedColor
  ctx.textAlign = "center"
  ctx.fillText("NFT Marketplace Architecture", centerX, 40)
}

function drawDaoDiagram(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const centerX = width / 2
  const centerY = height / 2

  // Define colors
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#0070f3"
  const mutedColor =
    getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim() || "#888888"
  const backgroundColor =
    getComputedStyle(document.documentElement).getPropertyValue("--background").trim() || "#ffffff"

  // Draw boxes for the architecture
  const boxWidth = 120
  const boxHeight = 60
  const boxSpacing = 40
  const boxRadius = 8

  // User Interface Layer
  ctx.beginPath()
  roundedRect(ctx, centerX - 250, centerY - 180, 500, 100, boxRadius)
  ctx.fillStyle = backgroundColor
  ctx.fill()
  ctx.strokeStyle = primaryColor
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.font = "16px sans-serif"
  ctx.fillStyle = mutedColor
  ctx.textAlign = "center"
  ctx.fillText("User Interface Layer", centerX, centerY - 150)

  // Draw UI components
  ctx.font = "12px sans-serif"
  ctx.fillText("Proposal Creation", centerX - 150, centerY - 130)
  ctx.fillText("Voting Interface", centerX, centerY - 130)
  ctx.fillText("Member Dashboard", centerX + 150, centerY - 130)

  // Governance Logic Layer
  ctx.beginPath()
  roundedRect(ctx, centerX - 250, centerY - 50, 500, 100, boxRadius)
  ctx.fillStyle = backgroundColor
  ctx.fill()
  ctx.strokeStyle = primaryColor
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.font = "16px sans-serif"
  ctx.fillText("Governance Logic Layer", centerX, centerY - 20)

  // Draw logic components
  ctx.font = "12px sans-serif"
  ctx.fillText("Voting Power Calculation", centerX - 150, centerY)
  ctx.fillText("Proposal Management", centerX, centerY)
  ctx.fillText("Treasury Management", centerX + 150, centerY)

  // Smart Contract Layer
  ctx.beginPath()
  roundedRect(ctx, centerX - 250, centerY + 80, 500, 100, boxRadius)
  ctx.fillStyle = backgroundColor
  ctx.fill()
  ctx.strokeStyle = primaryColor
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.font = "16px sans-serif"
  ctx.fillText("Smart Contract Layer", centerX, centerY + 110)

  // Draw contract components
  ctx.font = "12px sans-serif"
  ctx.fillText("Governance Token", centerX - 150, centerY + 130)
  ctx.fillText("Voting Contract", centerX, centerY + 130)
  ctx.fillText("Treasury Contract", centerX + 150, centerY + 130)

  // Draw arrows
  drawArrow(ctx, centerX, centerY - 80, centerX, centerY - 50, primaryColor)
  drawArrow(ctx, centerX, centerY + 50, centerX, centerY + 80, primaryColor)

  // Draw title
  ctx.font = "18px sans-serif"
  ctx.fillStyle = mutedColor
  ctx.textAlign = "center"
  ctx.fillText("DAO Governance Architecture", centerX, 40)
}

function drawGenericDiagram(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const centerX = width / 2
  const centerY = height / 2

  // Define colors
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#0070f3"
  const mutedColor =
    getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim() || "#888888"
  const backgroundColor =
    getComputedStyle(document.documentElement).getPropertyValue("--background").trim() || "#ffffff"

  // Draw boxes for the architecture
  const boxWidth = 120
  const boxHeight = 60
  const boxSpacing = 40
  const boxRadius = 8

  // User Interface
  ctx.beginPath()
  roundedRect(ctx, centerX - boxWidth / 2, centerY - 150, boxWidth, boxHeight, boxRadius)
  ctx.fillStyle = backgroundColor
  ctx.fill()
  ctx.strokeStyle = primaryColor
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.font = "14px sans-serif"
  ctx.fillStyle = mutedColor
  ctx.textAlign = "center"
  ctx.fillText("User Interface", centerX, centerY - 120)

  // Frontend Logic
  ctx.beginPath()
  roundedRect(ctx, centerX - boxWidth / 2, centerY - 50, boxWidth, boxHeight, boxRadius)
  ctx.fillStyle = backgroundColor
  ctx.fill()
  ctx.strokeStyle = primaryColor
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillText("Frontend Logic", centerX, centerY - 20)

  // Smart Contracts
  ctx.beginPath()
  roundedRect(ctx, centerX - boxWidth / 2, centerY + 50, boxWidth, boxHeight, boxRadius)
  ctx.fillStyle = backgroundColor
  ctx.fill()
  ctx.strokeStyle = primaryColor
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillText("Smart Contracts", centerX, centerY + 80)

  // Stellar Blockchain
  ctx.beginPath()
  roundedRect(ctx, centerX - boxWidth / 2, centerY + 150, boxWidth, boxHeight, boxRadius)
  ctx.fillStyle = backgroundColor
  ctx.fill()
  ctx.strokeStyle = primaryColor
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillText("Stellar Blockchain", centerX, centerY + 180)

  // Draw arrows
  drawArrow(ctx, centerX, centerY - 90, centerX, centerY - 50, primaryColor)
  drawArrow(ctx, centerX, centerY + 10, centerX, centerY + 50, primaryColor)
  drawArrow(ctx, centerX, centerY + 110, centerX, centerY + 150, primaryColor)

  // Draw labels
  ctx.font = "12px sans-serif"
  ctx.fillStyle = mutedColor
  ctx.fillText("User Interactions", centerX + 70, centerY - 70)
  ctx.fillText("API Calls", centerX + 70, centerY + 30)
  ctx.fillText("Transactions", centerX + 70, centerY + 130)

  // Draw title
  ctx.font = "16px sans-serif"
  ctx.fillStyle = mutedColor
  ctx.textAlign = "center"
  ctx.fillText("Web3 Dapp Architecture", centerX, 40)
}

// Helper function to draw rounded rectangles
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
) {
  const headLength = 10
  const angle = Math.atan2(toY - fromY, toX - fromX)

  // Draw line
  ctx.beginPath()
  ctx.moveTo(fromX, fromY)
  ctx.lineTo(toX, toY)
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.stroke()

  // Draw arrowhead
  ctx.beginPath()
  ctx.moveTo(toX, toY)
  ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6))
  ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6))
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

