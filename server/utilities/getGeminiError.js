/**
 * Extracts message from Gemini API error.
 */
export const getGeminiError = (error) => {
  const raw = error?.message ?? '';

  try {
    const jsonText = raw.replace(/^ApiError:\s*/, '').trim();
    const parsed = JSON.parse(jsonText);
    return parsed?.error?.message ?? parsed?.message ?? 'Error calling Gemini.';
  } catch {
    return raw || 'Error calling Gemini.';
  }
}