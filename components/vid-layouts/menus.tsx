import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Tooltip from "@radix-ui/react-tooltip"

import { useMediaPlayer, usePlaybackRateOptions } from "@vidstack/react"
import { CheckCircle, CircleIcon, SettingsIcon } from "lucide-react"
import { buttonClass, tooltipClass } from "./buttons"

export interface SettingsProps {
  side?: DropdownMenu.DropdownMenuContentProps["side"]
  align?: DropdownMenu.DropdownMenuContentProps["align"]
  offset?: DropdownMenu.DropdownMenuContentProps["sideOffset"]
  tooltipSide?: Tooltip.TooltipContentProps["side"]
  tooltipAlign?: Tooltip.TooltipContentProps["align"]
  tooltipOffset?: number
}

const menuClass =
  "animate-out fade-out z-[9999] slide-in-from-bottom-4 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-out-to-bottom-2 overflow-y-scroll flex max-h-[200px] min-w-[150px] flex-col rounded-md border border-white/10 bg-black/95 p-2.5 font-sans text-[15px] font-medium outline-none backdrop-blur-sm duration-300"

export function Settings({
  side = "top",
  align = "end",
  offset = 0,
  tooltipSide = "top",
  tooltipAlign = "center",
  tooltipOffset = 30,
}: SettingsProps) {
  const player = useMediaPlayer(),
    options = usePlaybackRateOptions()
  let hint = options.selectedValue ?? "Off"
  return (
    <DropdownMenu.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <DropdownMenu.Trigger
            aria-label="Settings"
            className={buttonClass}
            disabled={options.disabled}
          >
            <SettingsIcon className="h-7 w-7" />
          </DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content
          className={tooltipClass}
          side={tooltipSide}
          align={tooltipAlign}
          sideOffset={tooltipOffset}
        >
          Settings
        </Tooltip.Content>
      </Tooltip.Root>
      <DropdownMenu.Content
        className={menuClass}
        side={side}
        align={align}
        sideOffset={offset}
        collisionBoundary={player?.el}
      >
        <DropdownMenu.Label className="mb-2 flex w-full items-center px-1.5 font-medium text-[15px]">
          <SettingsIcon className="mr-1.5 h-5 w-5 translate-y-px" />
          Speed
          <span className="ml-auto text-sm text-white/50">{hint}</span>
        </DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          aria-label="Settings"
          className="flex w-full flex-col"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

function Radio({
  children,
  ...props
}: DropdownMenu.DropdownMenuRadioItemProps) {
  return (
    <DropdownMenu.RadioItem
      className="group relative flex w-full cursor-pointer select-none items-center justify-start rounded-sm hocus:bg-white/10 p-2.5 text-sm outline-none ring-media-focus data-[focus]:ring-[3px]"
      {...props}
    >
      <CircleIcon className="h-4 w-4 text-white group-data-[state=checked]:hidden" />
      <CheckCircle className="hidden h-4 w-4 text-media-brand group-data-[state=checked]:block" />
      <span className="ml-2">{children}</span>
    </DropdownMenu.RadioItem>
  )
}
