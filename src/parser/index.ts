import { Transform, TransformCallback } from 'node:stream';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parse } = require('debian-control');

export class DebPackageSummaryParser extends Transform {
  private _lastLineData: string;
  _transform(chunk: string, enc: string, cb: TransformCallback): void {
    let data = chunk.toString();
    if (this._lastLineData) data = this._lastLineData + data;
    const pkgInfos = data.split('\n\n');
    this._lastLineData = pkgInfos.splice(pkgInfos.length - 1, 1)[0];
    pkgInfos.forEach(this.push.bind(this));
    cb();
  }
  _flush(cb: TransformCallback): void {
    if (this._lastLineData) this.push(this._lastLineData);
    this._lastLineData = null;
    cb();
  }
}

import { DebPackageService } from '../Service';
import { IPackage, IPackageSummary } from '../types';

export class DebPackageDetailParser extends Transform {
  private isFirst = true;
  _transform(chunk: string, enc: string, cb: TransformCallback): void {
    if (this.isFirst) {
      this.push('[');
    }
    this.isFirst = false;
    const pkg: IPackageSummary = parse(chunk.toString());
    DebPackageService.getPackageInfo(pkg.Package, pkg.Version)
      .then((data: string) => {
        const pkgInfo = chunk.toString() + '\n' + data;
        this.push('\n');
        this.push(JSON.stringify(parseDepPackage(pkgInfo)));
        this.push(',');
      })
      .finally(cb);
  }
  _flush(cb: TransformCallback): void {
    this.push('\b\n]');
    cb();
  }
}

export function parseDepPackage(text: string): IPackage {
  const obj = parse(text);
  return {
    Package: Reflect.get(obj, 'Package'),
    Version: Reflect.get(obj, 'Version'),
    License: Reflect.get(obj, 'License'),
    Description: Reflect.get(obj, 'Description'),
    Maintainer: Reflect.get(obj, 'Maintainer'),
  };
}
