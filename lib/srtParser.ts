/**
 * SRT Parser Utility
 * Handles parsing of SRT subtitle files with UTF-8 encoding support
 * and robust regex pattern matching for timestamps and content
 */

export interface Subtitle {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

/**
 * Parse SRT file content into an array of Subtitle objects
 * Handles UTF-8 encoding and various timestamp formats
 * 
 * @param content - Raw SRT file content as string
 * @returns Array of parsed Subtitle objects
 */
export function parseSRTContent(content: string): Subtitle[] {
  // Normalize line endings (handle Windows, Mac, and Unix line endings)
  const normalizedContent = content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  // Split by blank lines (one or more empty lines)
  const blocks = normalizedContent
    .trim()
    .split(/\n\s*\n+/);

  const subtitles: Subtitle[] = [];

  blocks.forEach((block) => {
    const lines = block.trim().split('\n');

    // Each SRT block should have at least 3 lines:
    // 1. Index number
    // 2. Timestamp (00:00:00,000 --> 00:00:05,000)
    // 3. Subtitle text (can be multiple lines)
    if (lines.length >= 3) {
      const indexLine = lines[0].trim();
      const timeLine = lines[1].trim();
      const textLines = lines.slice(2);

      // Parse index (should be a number)
      const index = parseInt(indexLine, 10);
      if (isNaN(index)) return;

      // Parse timestamp line with flexible regex
      // Handles formats like: 00:00:00,000 --> 00:00:05,000
      // Also handles variations with spaces around arrow
      const timeMatch = timeLine.match(
        /(\d{1,2}:\d{2}:\d{2}[,.]?\d{0,3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[,.]?\d{0,3})/
      );

      if (!timeMatch) return;

      const startTime = timeMatch[1];
      const endTime = timeMatch[2];

      // Join text lines and trim trailing whitespace
      const text = textLines
        .join('\n')
        .trim();

      if (text) {
        subtitles.push({
          id: index,
          startTime,
          endTime,
          text,
        });
      }
    }
  });

  return subtitles;
}

/**
 * Convert Subtitle array back to SRT format string
 * Ensures proper UTF-8 encoding and SRT structure
 * 
 * @param subtitles - Array of Subtitle objects
 * @returns SRT formatted string
 */
export function subtitlesToSRTString(subtitles: Subtitle[]): string {
  return subtitles
    .map((sub) => {
      return `${sub.id}\n${sub.startTime} --> ${sub.endTime}\n${sub.text}\n`;
    })
    .join('\n');
}

/**
 * Validate if a string is a valid SRT file format
 * 
 * @param content - Raw SRT file content
 * @returns Boolean indicating if content is valid SRT
 */
export function isValidSRTFormat(content: string): boolean {
  const blocks = content
    .trim()
    .split(/\n\s*\n+/);

  if (blocks.length === 0) return false;

  // Check if at least one block has valid SRT structure
  return blocks.some((block) => {
    const lines = block.trim().split('\n');
    if (lines.length < 3) return false;

    const timeLine = lines[1].trim();
    const timeMatch = timeLine.match(
      /(\d{1,2}:\d{2}:\d{2}[,.]?\d{0,3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[,.]?\d{0,3})/
    );

    return timeMatch !== null;
  });
}
