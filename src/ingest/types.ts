/**
 * Shared Ingest Types
 *
 * Common type definitions used across CSV and DB ingestion modules.
 */

/**
 * Options for ingestion operations
 */
export type IngestOptions = {
	/** Directories to search for attachment files */
	attachmentRoots: string[]
	/** Optional date filter for CSV ingestion (YYYY-MM-DD) */
	messageDate?: string
}

/**
 * Database message structure from Messages.app SQLite
 */
export type DBMessage = {
	guid: string
	rowid?: number
	text?: string | null
	is_from_me: number
	date: number // Apple epoch in seconds or nanoseconds
	chat_id?: string
	handle?: string
	service?: string
	subject?: string | null
	attachments?: DBAttachment[]
	[key: string]: unknown
}

/**
 * Database attachment structure
 */
export type DBAttachment = {
	id: string
	filename: string
	mime_type?: string
	uti?: string | null
	copied_path?: string
	total_bytes?: number
	[key: string]: unknown
}

/**
 * CSV row structure (dynamic keys from headers)
 */
export type CSVRow = {
	[key: string]: string | undefined
}
