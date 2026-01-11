/**
 * Media Utilities
 *
 * Shared media type inference functions used across ingestion modules.
 */

/**
 * Media kind classification for attachments
 */
export type MediaKind = 'image' | 'audio' | 'video' | 'pdf' | 'unknown'

/**
 * Infer media kind from MIME type.
 *
 * @param mimeType - The MIME type string (e.g., 'image/jpeg', 'audio/mpeg')
 * @returns The classified media kind
 */
export function inferMediaKind(mimeType: string): MediaKind {
	if (!mimeType) return 'unknown'

	if (mimeType.startsWith('image/')) return 'image'
	if (mimeType.startsWith('audio/')) return 'audio'
	if (mimeType.startsWith('video/')) return 'video'
	if (mimeType.includes('pdf')) return 'pdf'

	return 'unknown'
}
