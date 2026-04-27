import fs from 'fs/promises';
import path from 'path';

export async function generateImage(
  word: string,
  category: string,
  imagePrompt: string,
): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
    }),
  });

  if (!res.ok) {
    throw new Error(`DALL-E API error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { data: { url: string }[] };
  const imageUrl = json.data[0].url;

  const imgRes = await fetch(imageUrl);
  const buffer = Buffer.from(await imgRes.arrayBuffer());

  const outDir = path.join('output', category);
  await fs.mkdir(outDir, { recursive: true });
  const filePath = path.join(outDir, `${word}.png`);
  await fs.writeFile(filePath, buffer);
  return filePath;
}
