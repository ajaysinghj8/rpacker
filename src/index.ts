import { DebPackageService } from './Service';
import { DebPackageDetailParser, DebPackageSummaryParser, parseDepPackage } from './parser';

export function main() {
  DebPackageService.getPackages()
    .pipe(new DebPackageSummaryParser({ objectMode: true }))
    .pipe(new DebPackageDetailParser({ objectMode: true }))
    .pipe(process.stdout);
}
