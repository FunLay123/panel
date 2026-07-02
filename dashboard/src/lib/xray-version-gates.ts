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

// Verified directly against XTLS/Xray-core commit-to-tag ancestry via the GitHub API
// (`gh api repos/XTLS/Xray-core/compare/<commit>...<tag>`), not just changelog reading —
// the two prior values below were caught reading the changelog PR as if all three
// changes shipped together in the same release, when in fact each landed on its own date:
//   - allowInsecure -> pinnedPeerCertSha256: commit 2c92339f, 2026-01-30.
//     v26.1.23 lacks it, v26.1.31 has it (verified via compare ahead_by/behind_by).
//   - echForceQuery removed: commit 1fc6850d (#6032), 2026-05-02.
//     v26.4.25 lacks it, v26.5.3 has it.
//   - session*->sessionID* rename + sessionIDTable/sessionIDLength: commit e10347bf (#6258), 2026-06-09.
//     v26.6.1 lacks it, v26.6.22 has it. This one alone matches 26.6.22.
export const XRAY_FEATURE_GATES = {
  echForceQueryRemoved: '26.5.3',
  allowInsecureHardError: '26.1.31',
  sessionIdFieldsRenamed: '26.6.22',
} as const
