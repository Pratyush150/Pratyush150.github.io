/**
 * How the brief form submits from a static host.
 *
 * The design brief's ranked call is Web3Forms as the primary, written so the
 * form submits natively without JavaScript, with a permanently visible mailto
 * alternative. Web3Forms needs one public access key, which does not exist yet
 * — so this file is the single place it gets filled in.
 *
 *   WEB3FORMS_KEY = ''      → the form composes a real, well-formatted email.
 *                             With JavaScript it builds a structured mailto:
 *                             with every answer labelled; without JavaScript
 *                             the native form action still opens a draft.
 *   WEB3FORMS_KEY = '<uuid>' → the form POSTs natively to Web3Forms, works with
 *                             JavaScript disabled, and the mailto stays visible
 *                             underneath as the escape hatch.
 *
 * Nothing else in the app needs to change. There is deliberately no
 * `REPLACE_ME` placeholder here: an empty string is a valid, working state.
 */
export const WEB3FORMS_KEY = '';

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export const SUBJECT = 'A problem for you — via pratyush150.github.io';
