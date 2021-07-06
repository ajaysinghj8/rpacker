export interface IPackageSummary {
  Package: string;
  Version: string;
  Maintainer: string;
}

export interface IPackage extends IPackageSummary {
  Description: string;
  License: string;
}
