import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export function loadSvgResources (ir: MatIconRegistry, ds: DomSanitizer) {
    ir.addSvgIcon(
        'gifts', 
        ds.bypassSecurityTrustResourceUrl('assets/gifts.svg')
    );
}