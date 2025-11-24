"use client"

import * as React from "react"

export type ToastActionElement = React.ReactElement

export interface ToastProps {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: "default" | "destructive"
}

export function Toast({
  title,
  description,
  action,
  variant = "default",
}: ToastProps) {
  return (
    <div
      className={`rounded-md border p-4 shadow-md bg-white 
      ${variant === "destructive" ? "border-red-500" : "border-gray-300"}`}
    >
      {title ? <h3 className="font-semibold">{title}</h3> : null}
      {description ? (
        <p className="text-sm text-gray-700">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
