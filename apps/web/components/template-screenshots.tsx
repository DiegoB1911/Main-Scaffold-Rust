"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface TemplateScreenshotsProps {
  templateId: string
}

export function TemplateScreenshots({ templateId }: TemplateScreenshotsProps) {
  // This would normally fetch screenshots based on the template ID
  const screenshots = [
    {
      id: 1,
      title: "Homepage",
      description: "Main landing page with featured items and categories",
      image: "/placeholder.svg?height=400&width=800",
    },
    {
      id: 2,
      title: "Product Detail",
      description: "Detailed view of an NFT with bidding history and ownership information",
      image: "/placeholder.svg?height=400&width=800",
    },
    {
      id: 3,
      title: "User Dashboard",
      description: "User profile with owned and created items",
      image: "/placeholder.svg?height=400&width=800",
    },
    {
      id: 4,
      title: "Create Listing",
      description: "Form for creating a new NFT listing",
      image: "/placeholder.svg?height=400&width=800",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % screenshots.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + screenshots.length) % screenshots.length)
  }

  const currentScreenshot = screenshots[currentIndex]

  return (
    <div className="space-y-4">
      <div className="relative aspect-video overflow-hidden rounded-lg border">
        <Image
          src={currentScreenshot.image || "/placeholder.svg"}
          alt={currentScreenshot.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm" onClick={prevSlide}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm" onClick={nextSlide}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4">
          <h3 className="font-medium">{currentScreenshot.title}</h3>
          <p className="text-sm text-muted-foreground">{currentScreenshot.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {screenshots.map((screenshot, index) => (
          <Card
            key={screenshot.id}
            className={`relative aspect-video overflow-hidden cursor-pointer transition-all ${
              index === currentIndex ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <Image src={screenshot.image || "/placeholder.svg"} alt={screenshot.title} fill className="object-cover" />
          </Card>
        ))}
      </div>
    </div>
  )
}

