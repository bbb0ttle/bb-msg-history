import { THEME } from '../const/theme.js';
/**
 * Generate a letter avatar with the given letter
 */
export function generateLetterAvatar(letter) {
    return `<div style="
    width: 100%; 
    height: 100%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    background: #ffffff; 
    color: ${THEME.gray[600]}; 
    font-size: 14px; 
    font-weight: 600;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  ">${letter}</div>`;
}
