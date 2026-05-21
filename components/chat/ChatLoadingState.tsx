"use client";

import { ChatConversationSkeleton } from "@/components/chat/ChatSkeletons";

/** @deprecated Use ChatConversationSkeleton directly */
export function ChatLoadingState() {
  return <ChatConversationSkeleton />;
}
