import { InjectionToken } from '@angular/core';

export interface SidesheetConfig {
  closeButton: boolean;
  scrollShadow: boolean;
  overlay: boolean;
  overlayCloseOnClick: boolean;
  overlayCloseOnESC: boolean;
}

export const SIDESHEET_CONFIG = new InjectionToken<SidesheetConfig>(
  'SidesheetConfig'
);
