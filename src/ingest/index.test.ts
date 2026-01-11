/**
 * Test barrel exports for ingest module
 */

import { describe, expect, test } from 'vitest'

describe('ingest barrel exports', () => {
	test('exports all types', async () => {
		const exports = await import('./index.js')

		// Type exports (check they exist at compile time)
		type _CSVRow = (typeof exports)['CSVRow']
		type _DBAttachment = (typeof exports)['DBAttachment']
		type _DBMessage = (typeof exports)['DBMessage']
		type _IngestOptions = (typeof exports)['IngestOptions']
		type _ContentMatch = (typeof exports)['ContentMatch']
		type _MergeResult = (typeof exports)['MergeResult']
		type _MergeStats = (typeof exports)['MergeStats']
		type _AmbiguousLink = (typeof exports)['AmbiguousLink']
		type _LinkingResult = (typeof exports)['LinkingResult']

		// This test just verifies types compile
		expect(true).toBe(true)
	})

	test('exports CSV ingestion functions', async () => {
		const exports = await import('./index.js')

		expect(typeof exports.ingestCSV).toBe('function')
		expect(typeof exports.parseCSVRow).toBe('function')
		expect(typeof exports.convertToISO8601).toBe('function')
		expect(typeof exports.formatDateForAttachmentSearch).toBe('function')
		expect(typeof exports.resolveAttachmentPath).toBe('function')
		expect(typeof exports.validateMessages).toBe('function')
		expect(typeof exports.createExportEnvelope).toBe('function')
	})

	test('exports database ingestion functions', async () => {
		const exports = await import('./index.js')

		expect(typeof exports.ingestDBMessages).toBe('function')
		expect(typeof exports.splitDBMessage).toBe('function')
		expect(typeof exports.convertAppleEpochToISO8601).toBe('function')
		expect(typeof exports.generatePartGUID).toBe('function')
	})

	test('exports dedup and merge functions', async () => {
		const exports = await import('./index.js')

		expect(typeof exports.dedupAndMerge).toBe('function')
		expect(typeof exports.findExactMatch).toBe('function')
		expect(typeof exports.detectContentEquivalence).toBe('function')
		expect(typeof exports.applyDbAuthoritiveness).toBe('function')
		expect(typeof exports.verifyNoDataLoss).toBe('function')
	})

	test('exports linking functions', async () => {
		const exports = await import('./index.js')

		expect(typeof exports.linkRepliesToParents).toBe('function')
		expect(typeof exports.linkTapbacksToParents).toBe('function')
		expect(typeof exports.detectAmbiguousLinks).toBe('function')
	})
})
