/* Ícones em traço fino: métodos (48px) e interface (24px). */
export const MI={
 v60:'<path d="M8 13h32"/><path d="M11 13l9 18h8l9-18"/><path d="M20 31v3h8v-3"/><path d="M13 39h22"/>',
 kalita:'<path d="M9 13q3-3 6 0t6 0t6 0t6 0t6 0"/><path d="M11 15l6 15h14l6-15"/><path d="M18 30v4h12v-4"/><path d="M13 39h22"/>',
 chemex:'<path d="M15 6h18l-7 16 7 20H15l7-20z"/><path d="M20.4 18.5h7.2M20.4 25.5h7.2"/>',
 aeropress:'<path d="M12 17h24"/><path d="M15 17v22a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V17"/><path d="M18 21V6h12v15"/><path d="M19 30h4M19 34h4"/>',
 clever:'<path d="M9 12h30"/><path d="M11 12l6 18h14l6-18"/><path d="M16 30h16v4H16z"/><path d="M13 39h22"/>',
 french:'<path d="M12 14h22"/><path d="M14 14v24a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V14"/><path d="M23 14V6M20 6h6"/><path d="M14 22h18"/><path d="M32 19h3a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-3"/>',
 moka:'<path d="M16 7h14l-2 14H18z"/><path d="M17 21h12"/><path d="M18 23h10l3 17H15z"/><path d="M16 7l-3-2"/><path d="M30 10h3.5l-1.5 9"/>',
 coldbrew:'<path d="M15 7h18v5H15z"/><path d="M14 12h20v26a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z"/><path d="M14 22q2.5-2 5 0t5 0t5 0t5 0"/>',
 drinks:'<path d="M14 9h20l-2.4 29.3a3 3 0 0 1-3 2.7h-9.2a3 3 0 0 1-3-2.7z"/><path d="M15 21h18"/><path d="M19 15.5c1.7-1.6 3.3-1.6 5 0s3.3 1.6 5 0"/>',
 espresso:'<path d="M12 21h22v7a8 8 0 0 1-8 8h-6a8 8 0 0 1-8-8z"/><path d="M34 23h2.5a3.5 3.5 0 0 1 0 7H33"/><path d="M8 41h30"/><path d="M19 8c-2 3 2 5 0 8M26 8c-2 3 2 5 0 8"/>'
};
export const UIC={
 home:'<path d="M4 11l8-6.5 8 6.5v8.5a1 1 0 0 1-1 1h-4.5V15h-5v5.5H5a1 1 0 0 1-1-1z"/>',
 hist:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 bean:'<ellipse cx="12" cy="12" rx="6" ry="8.6" transform="rotate(35 12 12)"/><path d="M8.6 17.4c3.2-2 3.8-8 6.8-10.8"/>',
 set:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
 back:'<path d="M15 5l-7 7 7 7"/>', close:'<path d="M6 6l12 12M18 6L6 18"/>', plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>',
 chev:'<path d="M9 5l7 7-7 7"/>', star:'<path d="M12 3.8l2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7.9-5.6-4-3.9 5.6-.8z"/>',
 rep:'<path d="M17 3l3 3-3 3"/><path d="M20 6H9a5 5 0 0 0-5 5"/><path d="M7 21l-3-3 3-3"/><path d="M4 18h11a5 5 0 0 0 5-5"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>', pause:'<path d="M9 6v12M15 6v12"/>', play:'<path d="M8 5.5v13l10.5-6.5z"/>', reset:'<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v4h4"/>'
};
export const ic=(k,cls='')=>`<svg class="${cls}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${MI[k]||''}</svg>`;
export const ui=(k,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${UIC[k]}</svg>`;
