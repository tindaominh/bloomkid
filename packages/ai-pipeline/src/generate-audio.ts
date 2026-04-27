import fs from 'fs/promises';
import path from 'path';

export async function generateAudio(word: string, category: string): Promise<string> {
  const res = await fetch(
    'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL',
    {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: word, model_id: 'eleven_multilingual_v2' }),
    },
  );

  if (!res.ok) {
    throw new Error(`ElevenLabs API error: ${res.status} ${res.statusText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const outDir = path.join('output', category);
  await fs.mkdir(outDir, { recursive: true });
  const filePath = path.join(outDir, `${word}.mp3`);
  await fs.writeFile(filePath, buffer);
  return filePath;
}
