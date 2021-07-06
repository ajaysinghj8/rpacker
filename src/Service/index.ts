import { get } from 'request';
import { createGunzip } from 'zlib';
import { Readable } from 'node:stream';

export class DebPackageService {
  public static getPackages(): Readable {
    return get('http://cran.r-project.org/src/contrib/PACKAGES.gz').pipe(createGunzip());
  }

  public static getPackageInfo(name: string, version: string): Promise<string> {
    const uri = `http://cran.r-project.org/src/contrib/${name}_${version}.tar.gz`;
    const dataStream = get(uri).pipe(createGunzip());
    return new Promise((resolve, reject) => {
      let data = '';
      dataStream.on('data', (chunk: string) => (data += chunk));
      dataStream.on('end', () => resolve(data));
      dataStream.on('error', reject);
    });
  }
}
