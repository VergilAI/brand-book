"use client"

import * as React from "react"
import { Label } from "@/components/label"
import { Input } from "@/components/input"
import { Switch } from "@/components/atomic/switch"
import { Card } from "@/components/card"
import { 
  X, 
  Clock, 
  Trophy, 
  RotateCcw, 
  Shuffle, 
  MessageSquare, 
  Settings2,
  ToggleLeft,
  Info
} from "lucide-react"
import { Button } from "@/components/button"

interface TestSettings {
  timeLimit?: number
  passingScore: number
  attemptsAllowed: number
  randomizeQuestions: boolean
  showFeedback: boolean
}

interface TestSettingsProps {
  settings: TestSettings
  onUpdate: (settings: TestSettings) => void
  onClose: () => void
}

export function TestSettings({ settings, onUpdate, onClose }: TestSettingsProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-spacing-lg border-b border-subtle"> {/* 24px, rgba(0,0,0,0.05) */}
        <div className="flex items-center gap-spacing-sm"> {/* 8px */}
          <Settings2 size={20} className="text-brand" /> {/* #7B00FF */}
          <h3 className="text-lg font-semibold text-primary"> {/* 20px, 600, #1D1D1F */}
            Test Settings
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X size={18} />
        </Button>
      </div>

      {/* Settings Form */}
      <div className="flex-1 overflow-y-auto p-spacing-lg space-y-spacing-lg"> {/* 24px, 24px */}
        {/* Basic Settings */}
        <div className="space-y-spacing-md"> {/* 16px */}
          <div className="flex items-center gap-spacing-xs"> {/* 4px */}
            <Settings2 size={18} className="text-secondary" /> {/* #6C6C6D */}
            <h4 className="text-base font-medium text-primary"> {/* 16px, 500, #1D1D1F */}
              Basic Settings
            </h4>
          </div>

          <div className="space-y-spacing-sm"> {/* 8px */}
            <div className="flex items-center gap-spacing-xs"> {/* 4px */}
              <Clock size={16} className="text-tertiary" /> {/* #71717A */}
              <Label htmlFor="time-limit" className="mb-0">
                Time Limit (minutes)
              </Label>
            </div>
            <Input
              id="time-limit"
              type="number"
              min="0"
              value={settings.timeLimit || ""}
              onChange={(e) => onUpdate({
                ...settings,
                timeLimit: e.target.value ? parseInt(e.target.value) : undefined
              })}
              placeholder="No time limit"
            />
            <p className="text-sm text-secondary"> {/* 14px, #6C6C6D */}
              Leave empty for unlimited time
            </p>
          </div>

          <div className="space-y-spacing-sm"> {/* 8px */}
            <div className="flex items-center gap-spacing-xs"> {/* 4px */}
              <Trophy size={16} className="text-tertiary" /> {/* #71717A */}
              <Label htmlFor="passing-score" className="mb-0">
                Passing Score (%)
              </Label>
            </div>
            <Input
              id="passing-score"
              type="number"
              min="0"
              max="100"
              value={settings.passingScore}
              onChange={(e) => onUpdate({
                ...settings,
                passingScore: parseInt(e.target.value) || 0
              })}
            />
            <p className="text-sm text-secondary"> {/* 14px, #6C6C6D */}
              Minimum percentage required to pass
            </p>
          </div>

          <div className="space-y-spacing-sm"> {/* 8px */}
            <div className="flex items-center gap-spacing-xs"> {/* 4px */}
              <RotateCcw size={16} className="text-tertiary" /> {/* #71717A */}
              <Label htmlFor="attempts" className="mb-0">
                Attempts Allowed
              </Label>
            </div>
            <Input
              id="attempts"
              type="number"
              min="1"
              value={settings.attemptsAllowed}
              onChange={(e) => onUpdate({
                ...settings,
                attemptsAllowed: parseInt(e.target.value) || 1
              })}
            />
            <p className="text-sm text-secondary"> {/* 14px, #6C6C6D */}
              Number of times a student can take this test
            </p>
          </div>
        </div>

        {/* Display Options */}
        <div className="space-y-spacing-md"> {/* 16px */}
          <div className="flex items-center gap-spacing-xs"> {/* 4px */}
            <ToggleLeft size={18} className="text-secondary" /> {/* #6C6C6D */}
            <h4 className="text-base font-medium text-primary"> {/* 16px, 500, #1D1D1F */}
              Display Options
            </h4>
          </div>

          <Card className="p-spacing-md space-y-spacing-md"> {/* 16px, 16px */}
            <div className="flex items-center justify-between">
              <div className="space-y-spacing-xs"> {/* 4px */}
                <div className="flex items-center gap-spacing-xs"> {/* 4px */}
                  <Shuffle size={16} className="text-info" /> {/* #0087FF */}
                  <Label htmlFor="randomize" className="text-base font-medium cursor-pointer mb-0"> {/* 16px, 500 */}
                    Randomize Questions
                  </Label>
                </div>
                <p className="text-sm text-secondary"> {/* 14px, #6C6C6D */}
                  Show questions in random order for each attempt
                </p>
              </div>
              <Switch
                id="randomize"
                checked={settings.randomizeQuestions}
                onCheckedChange={(checked) => onUpdate({
                  ...settings,
                  randomizeQuestions: checked
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-spacing-xs"> {/* 4px */}
                <div className="flex items-center gap-spacing-xs"> {/* 4px */}
                  <MessageSquare size={16} className="text-info" /> {/* #0087FF */}
                  <Label htmlFor="feedback" className="text-base font-medium cursor-pointer mb-0"> {/* 16px, 500 */}
                    Show Feedback
                  </Label>
                </div>
                <p className="text-sm text-secondary"> {/* 14px, #6C6C6D */}
                  Display correct answers after submission
                </p>
              </div>
              <Switch
                id="feedback"
                checked={settings.showFeedback}
                onCheckedChange={(checked) => onUpdate({
                  ...settings,
                  showFeedback: checked
                })}
              />
            </div>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="p-spacing-md bg-info-light border-info"> {/* 16px, #EFF6FF, #93C5FD */}
          <div className="flex items-start gap-spacing-sm"> {/* 8px */}
            <Info size={18} className="text-info mt-0.5 flex-shrink-0" /> {/* #0087FF */}
            <p className="text-sm text-info"> {/* 14px, #0087FF */}
              <strong>Note:</strong> These settings will apply to all students taking this test. 
              You can update them at any time before publishing.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}