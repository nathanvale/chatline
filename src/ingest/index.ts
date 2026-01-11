/**
 * Ingest Module - Public API
 *
 * Import and normalize iMessage data from CSV exports (iMazing) and Messages.app database.
 * Provides deduplication, merging, and reply/tapback linking functionality.
 *
 * @module ingest
 */

export type {
	ContentMatch,
	MergeResult,
	MergeStats,
} from './dedup-merge.js'
// ===== Deduplication & Merging =====
export {
	applyDbAuthoritiveness,
	dedupAndMerge,
	detectContentEquivalence,
	findExactMatch,
	verifyNoDataLoss,
} from './dedup-merge.js'
// ===== CSV Ingestion =====
// Note: createExportEnvelope exists in both ingest-csv.ts and ingest-db.ts
// Export from ingest-csv.ts as the primary implementation
export {
	convertToISO8601,
	createExportEnvelope,
	formatDateForAttachmentSearch,
	ingestCSV,
	parseCSVRow,
	resolveAttachmentPath,
	validateMessages,
} from './ingest-csv.js'
// ===== Database Ingestion =====
export {
	convertAppleEpochToISO8601,
	generatePartGUID,
	ingestDBMessages,
	splitDBMessage,
} from './ingest-db.js'
export type {
	AmbiguousLink,
	LinkingResult,
} from './link-replies-and-tapbacks.js'
// ===== Reply & Tapback Linking =====
export {
	detectAmbiguousLinks,
	linkRepliesToParents,
	linkTapbacksToParents,
} from './link-replies-and-tapbacks.js'
// ===== Types =====
export type {
	CSVRow,
	DBAttachment,
	DBMessage,
	IngestOptions,
} from './types.js'
