import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import path from 'path';

export interface LessonItem {
  word: string;
  syllables: number;
  imagePrompt: string;
  audioScript: string;
  soundEffect: string;
}

export async function generateLesson(
  category: string,
  count = 8,
): Promise<LessonItem[]> {
  const promptPath = path.resolve(__dirname, '../../../tools/prompts/lesson-script.md');
  const promptTemplate = await fs.readFile(promptPath, 'utf-8');

  const userContent = promptTemplate
    .replace('{{TOPIC}}', category)
    .replace('{{COUNT}}', String(count));

  const client = new Anthropic();
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: userContent }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error(`No JSON array found in Claude response for category: ${category}`);

  const items: LessonItem[] = JSON.parse(jsonMatch[0]);

  const outDir = path.join('output', category);
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(
    path.join(outDir, 'manifest.json'),
    JSON.stringify(items, null, 2),
  );

  return items;
}
