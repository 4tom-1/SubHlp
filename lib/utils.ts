import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ステータス管理用のユーティリティ関数
export const getStatusConfig = (status: string, billingCycle?: string) => {
  if (billingCycle === "trial_ended") {
    return {
      label: "トライアル終了",
      color: "bg-pink-100 text-pink-800",
      icon: "⏰"
    }
  }
  switch (status) {
    case "active":
      return {
        label: "利用中",
        color: "bg-green-100 text-green-800",
        icon: "✓"
      }
    case "paused":
      return {
        label: "一時停止中",
        color: "bg-yellow-100 text-yellow-800",
        icon: "⏸"
      }
    case "cancelled":
      return {
        label: "解約済み",
        color: "bg-red-100 text-red-800",
        icon: "✗"
      }
    case "pending_cancellation":
      return {
        label: "解約予定",
        color: "bg-orange-100 text-orange-800",
        icon: "⚠"
      }
    case "trial":
      return {
        label: "トライアル中",
        color: "bg-blue-100 text-blue-800",
        icon: "🎯"
      }
    default:
      return {
        label: "不明",
        color: "bg-gray-100 text-gray-800",
        icon: "?"
      }
  }
}

export const isActiveStatus = (status: string, billingCycle?: string) => {
  // trial_endedはアクティブ扱いしない
  return (status === "active" || status === "trial") && billingCycle !== "trial_ended"
}

export const isPayingStatus = (status: string, billingCycle?: string) => {
  // trial, trial_endedは課金扱いしない
  return (status === "active" || status === "pending_cancellation") && billingCycle !== "trial" && billingCycle !== "trial_ended"
}
