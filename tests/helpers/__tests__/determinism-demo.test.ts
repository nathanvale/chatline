/**
 * Demonstration of deterministic vs random fixture behavior
 *
 * This test demonstrates the difference between random and deterministic
 * message creation, and shows why deterministic fixtures are essential
 * for snapshot tests.
 */

import { describe, expect, it } from 'vitest'

import { createTestMessage } from '../datasets/determinism'
import {
	createMediaMessageFixture,
	createMessageFixture,
	createMessagesFixture,
} from '../fixture-loaders'

describe('Deterministic Fixture Behavior', () => {
	describe('Random vs Deterministic GUIDs', () => {
		it('should use random GUID format when not specified', () => {
			const msg = createMessageFixture({ text: 'Test' })

			// Should contain random components
			expect(msg.guid).toMatch(/^test-\d+-\d+/)
			expect(msg.date).toMatch(/^\d{4}-\d{2}-\d{2}T/)
		})

		it('should generate same GUID when explicitly provided (deterministic)', () => {
			const msg1 = createMessageFixture({
				guid: 'test-123',
				date: '2025-01-15T10:00:00Z',
				text: 'Test',
			})
			const msg2 = createMessageFixture({
				guid: 'test-123',
				date: '2025-01-15T10:00:00Z',
				text: 'Test',
			})

			// Deterministic values should match
			expect(msg1.guid).toBe(msg2.guid)
			expect(msg1.date).toBe(msg2.date)
			expect(msg1).toEqual(msg2)
		})

		it('should use createTestMessage for deterministic defaults', () => {
			const msg1 = createTestMessage({ text: 'Test' })
			const msg2 = createTestMessage({ text: 'Test' })

			// createTestMessage defaults to fixed values
			expect(msg1.guid).toBe('guid-fixed')
			expect(msg2.guid).toBe('guid-fixed')
			expect(msg1.date).toBe('2025-01-15T10:00:00Z')
			expect(msg2.date).toBe('2025-01-15T10:00:00Z')
			expect(msg1).toEqual(msg2)
		})
	})

	describe('Deterministic Batch Creation', () => {
		it('should create deterministic message batch', () => {
			const messages1 = createMessagesFixture(3, (i) => ({
				guid: `test-msg-${i}`,
				date: `2025-01-15T10:${String(i).padStart(2, '0')}:00Z`,
				text: `Message ${i}`,
			}))

			const messages2 = createMessagesFixture(3, (i) => ({
				guid: `test-msg-${i}`,
				date: `2025-01-15T10:${String(i).padStart(2, '0')}:00Z`,
				text: `Message ${i}`,
			}))

			expect(messages1).toEqual(messages2)
		})
	})

	describe('Media Message Determinism', () => {
		it('should create deterministic media message', () => {
			const img1 = createMediaMessageFixture('image', {
				guid: 'img-123',
				date: '2025-01-15T10:00:00Z',
				media: {
					id: 'media-123',
					filename: 'photo.jpg',
				},
			})

			const img2 = createMediaMessageFixture('image', {
				guid: 'img-123',
				date: '2025-01-15T10:00:00Z',
				media: {
					id: 'media-123',
					filename: 'photo.jpg',
				},
			})

			expect(img1).toEqual(img2)
		})

		it('should use random media ID format when not specified', () => {
			const img = createMediaMessageFixture('image')

			// Should use timestamp-based format
			expect(img.media?.id).toMatch(/^media-\d+$/)
		})
	})

	describe('Snapshot Test Pattern', () => {
		it('should produce stable snapshots with deterministic fixtures', () => {
			const msg = createMessageFixture({
				guid: 'snapshot-test-123',
				date: '2025-01-15T10:00:00Z',
				text: 'Snapshot test message',
				handle: 'Test User',
				isFromMe: false,
			})

			// This snapshot will be stable across test runs
			expect(msg).toMatchInlineSnapshot(`
				{
				  "date": "2025-01-15T10:00:00Z",
				  "guid": "snapshot-test-123",
				  "handle": "Test User",
				  "isFromMe": false,
				  "isRead": false,
				  "messageKind": "text",
				  "metadata": {
				    "source": "test-fixture",
				  },
				  "service": "iMessage",
				  "text": "Snapshot test message",
				}
			`)
		})

		it('should produce stable snapshots with createTestMessage', () => {
			const msg = createTestMessage({ text: 'Snapshot test' })

			// Stable snapshot using createTestMessage defaults
			expect(msg).toMatchInlineSnapshot(`
				{
				  "date": "2025-01-15T10:00:00Z",
				  "guid": "guid-fixed",
				  "handle": "Test User",
				  "isFromMe": false,
				  "isRead": false,
				  "messageKind": "text",
				  "metadata": {
				    "source": "test-builder",
				  },
				  "service": "iMessage",
				  "text": "Snapshot test",
				}
			`)
		})
	})
})
