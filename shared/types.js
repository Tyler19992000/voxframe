/**
 * Shared type definitions for VoxFrame.
 * Used by both client and server for consistency.
 */

/** @typedef {{ start: number, end: number, text?: string }} TimestampSegment */

/** @typedef {'free' | 'starter' | 'pro'} PlanType */

/** @typedef {{ id: string, name: string, images: ProjectImage[], audioUrl?: string, segments: TimestampSegment[], status: ProjectStatus, createdAt: string }} Project */

/** @typedef {'draft' | 'rendering' | 'done' | 'error'} ProjectStatus */

/** @typedef {{ id: string, filename: string, url: string, order: number }} ProjectImage */

/** @typedef {{ progress: number, status: 'queued' | 'rendering' | 'done' | 'error', downloadUrl?: string, error?: string }} RenderJob */

module.exports = {};
