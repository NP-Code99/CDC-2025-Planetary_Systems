"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, Table, Share2, Settings, CheckCircle2, Loader2 } from "lucide-react"
import { exportToPDF, exportToCSV, shareWorkout, exportDeviceSettings } from "@/lib/export-utils"
import type { WorkoutSession, WeeklySchedule } from "@/lib/workout-calculator"
import type { Exoplanet } from "@/lib/exoplanet-data"

interface ExportDialogProps {
  session: WorkoutSession
  weeklySchedule: WeeklySchedule
  planet: Exoplanet
  completedExercises?: number
  totalTime?: number
  trigger?: React.ReactNode
}

export function ExportDialog({
  session,
  weeklySchedule,
  planet,
  completedExercises,
  totalTime,
  trigger,
}: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [exportComplete, setExportComplete] = useState<string | null>(null)

  const handleExport = async (type: "pdf" | "csv" | "share" | "device") => {
    setIsExporting(type)
    setExportComplete(null)

    try {
      switch (type) {
        case "pdf":
          await exportToPDF(session, weeklySchedule, planet, completedExercises, totalTime)
          break
        case "csv":
          exportToCSV(session, weeklySchedule, planet, completedExercises, totalTime)
          break
        case "share":
          await shareWorkout(session, planet, completedExercises, totalTime)
          break
        case "device":
          exportDeviceSettings(session, planet)
          break
      }
      setExportComplete(type)
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setIsExporting(null)
      if (type !== "share") {
        setTimeout(() => setExportComplete(null), 3000)
      }
    }
  }

  const ExportButton = ({
    type,
    icon: Icon,
    title,
    description,
    variant = "outline",
  }: {
    type: "pdf" | "csv" | "share" | "device"
    icon: any
    title: string
    description: string
    variant?: "outline" | "default"
  }) => (
    <Button
      variant={variant}
      size="lg"
      onClick={() => handleExport(type)}
      disabled={isExporting !== null}
      className="w-full justify-start h-auto p-4"
    >
      <div className="flex items-center gap-3 w-full">
        <div className="flex-shrink-0">
          {isExporting === type ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : exportComplete === type ? (
            <CheckCircle2 className="h-5 w-5 text-chart-5" />
          ) : (
            <Icon className="h-5 w-5" />
          )}
        </div>
        <div className="text-left flex-1">
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
    </Button>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export & Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Workout Data
          </DialogTitle>
          <DialogDescription>
            Export your {planet.name} workout program in various formats or share your results
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Summary */}
          <Card className="bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{planet.name} Training Session</CardTitle>
              <CardDescription>
                {session.gravityFraction.toFixed(2)}x Earth gravity • Intensity {session.intensityIndex}/10
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <div className="font-bold text-primary">{session.exercises.length}</div>
                  <div className="text-muted-foreground">Exercises</div>
                </div>
                <div>
                  <div className="font-bold text-accent">{session.duration}</div>
                  <div className="text-muted-foreground">Minutes</div>
                </div>
                {completedExercises !== undefined && (
                  <div>
                    <div className="font-bold text-chart-5">{completedExercises}</div>
                    <div className="text-muted-foreground">Completed</div>
                  </div>
                )}
                {totalTime !== undefined && (
                  <div>
                    <div className="font-bold text-chart-3">{totalTime}</div>
                    <div className="text-muted-foreground">Time Trained</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Export Options</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ExportButton
                type="pdf"
                icon={FileText}
                title="PDF Report"
                description="Complete workout program with exercises, schedule, and safety notes"
                variant="default"
              />

              <ExportButton
                type="csv"
                icon={Table}
                title="CSV Data"
                description="Structured data for analysis and tracking in spreadsheets"
              />

              <ExportButton
                type="device"
                icon={Settings}
                title="Device Settings"
                description="Equipment configurations and safety limits for gym machines"
              />

              <ExportButton
                type="share"
                icon={Share2}
                title="Share Results"
                description="Share your workout achievements on social media"
              />
            </div>
          </div>

          <Separator />

          {/* What's Included */}
          <div className="space-y-3">
            <h4 className="font-semibold">What's Included in Exports:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    PDF
                  </Badge>
                  <span>Complete formatted report</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    CSV
                  </Badge>
                  <span>Raw data for analysis</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Device
                  </Badge>
                  <span>Equipment settings & safety caps</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Share
                  </Badge>
                  <span>Social media summary</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground mt-4">
              All exports include planetary parameters, gravity scaling factors, exercise details, weekly schedule, and
              safety recommendations.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
