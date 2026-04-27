import * as FileSystem from 'expo-file-system';

export class OfflineCache {
  private baseDir = `${FileSystem.documentDirectory}bloomkid-cache/`;

  async ensure(remoteUrl: string, relativePath: string): Promise<string> {
    const localUri = `${this.baseDir}${relativePath}`;
    const info = await FileSystem.getInfoAsync(localUri);
    if (info.exists) return localUri;

    const dirUri = localUri.substring(0, localUri.lastIndexOf('/'));
    await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
    const result = await FileSystem.downloadAsync(remoteUrl, localUri);
    return result.uri;
  }
}
