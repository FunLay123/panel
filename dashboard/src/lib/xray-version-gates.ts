export interface ParsedXrayVersion {
  major: number
  minor: number
  patch: number
}

const VERSION_PATTERN = /^v?(\d+)\.(\d+)\.(\d+)$/

export function parseXrayVersion(v: string | null | undefined): ParsedXrayVersion | null {
  if (!v) return null
  const match = VERSION_PATTERN.exec(v.trim())
  if (!match) return null
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) }
}

export function compareXrayVersion(a: ParsedXrayVersion, b: ParsedXrayVersion): -1 | 0 | 1 {
  if (a.major !== b.major) return a.major > b.major ? 1 : -1
  if (a.minor !== b.minor) return a.minor > b.minor ? 1 : -1
  if (a.patch !== b.patch) return a.patch > b.patch ? 1 : -1
  return 0
}

/** Fail-open: returns false when `version` can't be parsed (unknown/"latest"/malformed). */
export function isXrayVersionAtLeast(version: string | null | undefined, cutoff: string): boolean {
  const parsedVersion = parseXrayVersion(version)
  const parsedCutoff = parseXrayVersion(cutoff)
  if (!parsedVersion || !parsedCutoff) return false
  return compareXrayVersion(parsedVersion, parsedCutoff) >= 0
}

// Verified against XTLS/Xray-core release tag history — see
// docs/superpowers/plans/2026-07-01-core-editor-xray-version-gating.md Task 1
// and docs/superpowers/specs/2026-07-02-core-editor-sessionid-migration-design.md.
export const XRAY_FEATURE_GATES = {
  echForceQueryRemoved: '26.6.22',
  allowInsecureHardError: '26.6.22',
  sessionIdFieldsRenamed: '26.6.22',
} as const
