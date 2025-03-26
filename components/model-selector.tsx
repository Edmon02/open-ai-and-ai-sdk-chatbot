"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"

const MODELS = [
  { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "gpt-4o", name: "GPT-4o" },
]

export function ModelSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (model: string) => void
}) {
  const selectedModel = MODELS.find((m) => m.id === value) || MODELS[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs flex gap-1 h-7">
          {selectedModel.name}
          <ChevronDownIcon size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {MODELS.map((model) => (
          <DropdownMenuItem key={model.id} onClick={() => onChange(model.id)} className="text-xs">
            {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

