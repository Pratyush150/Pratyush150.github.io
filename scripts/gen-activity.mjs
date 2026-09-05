/**
 * Generate the activity log from the repositories' own git history.
 *
 *   node scripts/gen-activity.mjs [--repos <dir>] [--limit 24]
 *
 * The brief is explicit that this section must be generated, never hand-written:
 * a dated log with real counts in it is something only a working studio can
 * produce, and a hand-maintained one goes stale within a month. A stale log is
 * worse than no log.
 *
 * The failure mode is deliberate. If this script has not run, the file it emits
 * does not exist, `<ActivityLog>` is not imported, and the section does not
 * render at all — which is the correct behaviour, and the reason there is no
 * placeholder anywhere in the app for it.
 *
 * It has NOT been run in this checkout, so the section is currently absent.
 * Run it against a directory of checked-out repositories to switch it on.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const reposDir = resolve(arg('repos', '../push'));
const limit = Number(arg('limit', 24));
const out = fileURLToPath(new URL('../src/content/activity.generated.json', import.meta.url));

if (!existsSync(reposDir)) {
  console.error(`gen-activity: no repository directory at ${reposDir}. Nothing written.`);
  process.exit(1);
}

const entries = [];
for (const name of readdirSync(reposDir)) {
  const repo = join(reposDir, name);
  if (!existsSync(join(repo, '.git'))) continue;
  let log = '';
  try {
    log = execFileSync(
      'git',
      ['-C', repo, 'log', '--no-merges', '-n', '8', '--date=short', '--pretty=format:%ad\t%s'],
      { encoding: 'utf8' },
    );
  } catch {
    continue; // a repository with no commits yet is not an error
  }
  const ci = existsSync(join(repo, '.github', 'workflows'));
  for (const line of log.split('\n').filter(Boolean)) {
    const [date, ...rest] = line.split('\t');
    entries.push({ date: date.replace(/-/g, '/'), repo: name, subject: rest.join(' '), ci });
  }
}

entries.sort((a, b) => (a.date < b.date ? 1 : -1));
const kept = entries.slice(0, limit);

if (kept.length === 0) {
  console.error('gen-activity: no commits found. Nothing written.');
  process.exit(1);
}

writeFileSync(out, `${JSON.stringify(kept, null, 2)}\n`);
console.log(`activity log: ${kept.length} entries from ${new Set(kept.map((e) => e.repo)).size} repositories -> ${out}`);
