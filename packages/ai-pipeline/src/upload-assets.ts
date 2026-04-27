import fs from 'fs/promises';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Client } from 'pg';

export interface AssetManifestItem {
  word: string;
  syllables: number;
  imagePrompt: string;
  audioScript: string;
  soundEffect: string;
  localImagePath: string;
  localAudioPath: string;
}

export interface UploadedItem extends AssetManifestItem {
  imageUrl: string;
  audioUrl: string;
}

export async function uploadAssets(
  category: string,
  manifest: AssetManifestItem[],
): Promise<UploadedItem[]> {
  const bucket = process.env.S3_BUCKET ?? '';
  const region = process.env.AWS_REGION ?? 'ap-southeast-1';
  const s3 = new S3Client({ region });

  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();

  const results: UploadedItem[] = [];

  for (const item of manifest) {
    const imageKey = `${category}/${item.word}.png`;
    const audioKey = `${category}/${item.word}.mp3`;

    const [imageData, audioData] = await Promise.all([
      fs.readFile(item.localImagePath),
      fs.readFile(item.localAudioPath),
    ]);

    await Promise.all([
      s3.send(new PutObjectCommand({ Bucket: bucket, Key: imageKey, Body: imageData, ContentType: 'image/png' })),
      s3.send(new PutObjectCommand({ Bucket: bucket, Key: audioKey, Body: audioData, ContentType: 'audio/mpeg' })),
    ]);

    const baseUrl = `https://${bucket}.s3.${region}.amazonaws.com`;
    const imageUrl = `${baseUrl}/${imageKey}`;
    const audioUrl = `${baseUrl}/${audioKey}`;

    await db.query(
      `INSERT INTO vocabulary_items (word, category, syllables, image_url, audio_url, image_prompt, audio_script, sound_effect)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (word, category) DO UPDATE SET image_url=$4, audio_url=$5`,
      [item.word, category, item.syllables, imageUrl, audioUrl, item.imagePrompt, item.audioScript, item.soundEffect],
    );

    results.push({ ...item, imageUrl, audioUrl });
  }

  await db.end();
  return results;
}
