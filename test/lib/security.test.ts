import { describe, it, expect } from 'vitest'
import { sanitizeInput, validateFileType, generateSecureFilename, isValidUrl } from '@/lib/security'

describe('Security', () => {
  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello World'
      const result = sanitizeInput(input)
      expect(result).toBe('Hello World')
    })

    it('should trim whitespace', () => {
      const input = '  Hello World  '
      const result = sanitizeInput(input)
      expect(result).toBe('Hello World')
    })

    it('should handle empty strings', () => {
      const result = sanitizeInput('')
      expect(result).toBe('')
    })

    it('should handle null and undefined', () => {
      expect(sanitizeInput(null)).toBe('')
      expect(sanitizeInput(undefined)).toBe('')
    })
  })

  describe('validateFileType', () => {
    it('should accept valid image types', () => {
      expect(validateFileType('image/jpeg')).toBe(true)
      expect(validateFileType('image/png')).toBe(true)
      expect(validateFileType('image/webp')).toBe(true)
    })

    it('should reject invalid file types', () => {
      expect(validateFileType('text/plain')).toBe(false)
      expect(validateFileType('application/pdf')).toBe(false)
      expect(validateFileType('video/mp4')).toBe(false)
    })

    it('should handle case insensitive types', () => {
      expect(validateFileType('IMAGE/JPEG')).toBe(true)
      expect(validateFileType('Image/PNG')).toBe(true)
    })
  })

  describe('generateSecureFilename', () => {
    it('should generate filename with timestamp', () => {
      const filename = generateSecureFilename('test.jpg')
      expect(filename).toMatch(/^\d+-test\.jpg$/)
    })

    it('should handle filenames with spaces', () => {
      const filename = generateSecureFilename('my test file.png')
      expect(filename).toMatch(/^\d+-my-test-file\.png$/)
    })

    it('should handle special characters', () => {
      const filename = generateSecureFilename('test@#$%.jpg')
      expect(filename).toMatch(/^\d+-test\.jpg$/)
    })

    it('should preserve file extension', () => {
      const filename = generateSecureFilename('test.webp')
      expect(filename).toEndWith('.webp')
    })
  })

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://example.com')).toBe(true)
      expect(isValidUrl('https://github.com/user/repo')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('ftp://example.com')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })

    it('should handle optional URLs', () => {
      expect(isValidUrl(undefined)).toBe(true)
      expect(isValidUrl(null)).toBe(true)
      expect(isValidUrl('')).toBe(false)
    })
  })
})